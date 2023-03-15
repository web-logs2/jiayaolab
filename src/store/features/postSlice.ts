import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OrderByModuleType } from '../../models/orderBy'
import { PostModelType } from '../../models/post'
import {
  findByRecommendWithPage,
  findBySearchWithPage,
} from '../../services/post'
import { findPostByUser } from '../../services/user'
import { RootState } from '../index'

// 响应锁，解决ReactStrict模式会请求多次导致页面重复渲染报错的问题！
let reactStrictModeLock = false
const POST_FEATURE_KEY = 'post'
const initialState: {
  loading: boolean
  posts: PostModelType[] | null
  errorMsg: string | null
  size: number
} = {
  // 数据正在获取中
  loading: true,
  // 获取到的帖子数据
  posts: null,
  // 数据获取失败，返回的错误信息
  errorMsg: null,
  // 当前页面大小
  size: 1,
}

export const findByRecommendWithPageHandler = createAsyncThunk<
  PostModelType[] | null,
  keyof PostModelType
>(`${POST_FEATURE_KEY}/getPostByField`, async (sortField, { getState }) => {
  const { postSlice } = getState() as RootState
  const { data } = await findByRecommendWithPage(postSlice.size, sortField)
  return data
})
export const findBySearchWithPageHandler = createAsyncThunk<
  PostModelType[] | null,
  {
    sortField: keyof PostModelType
    sortOrder: OrderByModuleType
    keywords: string
  }
>(
  `${POST_FEATURE_KEY}/getPostBySearch`,
  async ({ sortField, sortOrder, keywords }, { getState }) => {
    const { postSlice } = getState() as RootState
    const { data } = await findBySearchWithPage(
      postSlice.size,
      sortField,
      sortOrder,
      keywords.trim()
    )
    return data
  }
)
export const findPostByUserHandler = createAsyncThunk<
  PostModelType[] | null,
  string
>(`${POST_FEATURE_KEY}/getPostByUser`, async (userId, { getState }) => {
  const { postSlice } = getState() as RootState
  const { data } = await findPostByUser(userId, postSlice.size)
  return data
})

const postSlice = createSlice({
  name: POST_FEATURE_KEY,
  initialState,
  reducers: {
    clearPostList: state => {
      state.posts = null
    },
    setFetchSize: (state, { payload }: PayloadAction<number>) => {
      state.size = payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(findByRecommendWithPageHandler.pending, state => {
        state.loading = true
        state.errorMsg = null
        reactStrictModeLock = false
      })
      .addCase(findByRecommendWithPageHandler.fulfilled, (state, action) => {
        state.loading = false
        if (!reactStrictModeLock) {
          state.posts = [...(state.posts || []), ...(action.payload || [])]
          reactStrictModeLock = !reactStrictModeLock
        }
        state.errorMsg = null
      })
      .addCase(findByRecommendWithPageHandler.rejected, (state, action) => {
        state.loading = false
        state.posts = null
        if (action.error.message) {
          state.errorMsg = action.error.message
        }
      })
    builder
      .addCase(findBySearchWithPageHandler.pending, state => {
        state.loading = true
        state.errorMsg = null
        reactStrictModeLock = false
      })
      .addCase(findBySearchWithPageHandler.fulfilled, (state, action) => {
        state.loading = false
        if (!reactStrictModeLock) {
          state.posts = [...(state.posts || []), ...(action.payload || [])]
          reactStrictModeLock = !reactStrictModeLock
        }
        state.errorMsg = null
      })
      .addCase(findBySearchWithPageHandler.rejected, (state, action) => {
        state.loading = false
        state.posts = null
        if (action.error.message) {
          state.errorMsg = action.error.message
        }
      })
    builder
      .addCase(findPostByUserHandler.pending, state => {
        state.loading = true
        state.errorMsg = null
        reactStrictModeLock = false
      })
      .addCase(findPostByUserHandler.fulfilled, (state, action) => {
        state.loading = false
        if (!reactStrictModeLock) {
          state.posts = [...(state.posts || []), ...(action.payload || [])]
          reactStrictModeLock = !reactStrictModeLock
        }
        state.errorMsg = null
      })
      .addCase(findPostByUserHandler.rejected, (state, action) => {
        state.loading = false
        state.posts = null
        if (action.error.message) {
          state.errorMsg = action.error.message
        }
      })
  },
})
export const { clearPostList, setFetchSize } = postSlice.actions
export default postSlice.reducer
