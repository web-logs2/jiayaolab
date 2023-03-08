import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { OrderByModuleType } from '../../models/orderBy'
import { PostModelType } from '../../models/post'
import {
  fetchPostByCategories,
  fetchPostByConditions,
} from '../../services/post'
import { fetchPostByUser } from '../../services/user'

// 响应锁，解决ReactStrict模式会请求多次导致页面重复渲染报错的问题！
let reactStrictModeLock = false
const POST_FEATURE_KEY = 'post'
const initialState: {
  loading: boolean
  posts: PostModelType[] | null
  errorMsg: string | null
} = {
  // 数据正在获取中
  loading: true,
  // 获取到的帖子数据
  posts: null,
  // 数据获取失败，返回的错误信息
  errorMsg: null,
}

export const getPostByCategories = createAsyncThunk<
  PostModelType[] | null,
  { size: number; sortField: keyof PostModelType }
>(`${POST_FEATURE_KEY}/getPostByCategories`, async ({ size, sortField }) => {
  const { data } = await fetchPostByCategories(size, sortField)

  return data
})
export const getPostByConditions = createAsyncThunk<
  PostModelType[] | null,
  {
    size: number
    sortField: keyof PostModelType
    sortOrder: OrderByModuleType
    keywords: string
  }
>(
  `${POST_FEATURE_KEY}/getPostByConditions`,
  async ({ size, sortField, sortOrder, keywords }) => {
    const { data } = await fetchPostByConditions(
      size,
      sortField,
      sortOrder,
      keywords.trim()
    )

    return data
  }
)
export const getPostByUser = createAsyncThunk<
  PostModelType[] | null,
  {
    userId: string
    size: number
  }
>(`${POST_FEATURE_KEY}/getPostByUser`, async ({ userId, size }) => {
  const { data } = await fetchPostByUser(userId, size)

  return data
})

const postSlice = createSlice({
  name: POST_FEATURE_KEY,
  initialState,
  reducers: {
    postCleared: state => {
      state.posts = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getPostByCategories.pending, state => {
        state.loading = true
        state.errorMsg = null
        reactStrictModeLock = false
      })
      .addCase(getPostByCategories.fulfilled, (state, action) => {
        state.loading = false
        if (!reactStrictModeLock) {
          state.posts = [...(state.posts || []), ...(action.payload || [])]
          reactStrictModeLock = !reactStrictModeLock
        }
        state.errorMsg = null
      })
      .addCase(getPostByCategories.rejected, (state, action) => {
        state.loading = false
        state.posts = null
        if (action.error.message) {
          state.errorMsg = action.error.message
        }
      })
    builder
      .addCase(getPostByConditions.pending, state => {
        state.loading = true
        state.errorMsg = null
        reactStrictModeLock = false
      })
      .addCase(getPostByConditions.fulfilled, (state, action) => {
        state.loading = false
        if (!reactStrictModeLock) {
          state.posts = [...(state.posts || []), ...(action.payload || [])]
          reactStrictModeLock = !reactStrictModeLock
        }
        state.errorMsg = null
      })
      .addCase(getPostByConditions.rejected, (state, action) => {
        state.loading = false
        state.posts = null
        if (action.error.message) {
          state.errorMsg = action.error.message
        }
      })
    builder
      .addCase(getPostByUser.pending, state => {
        state.loading = true
        state.errorMsg = null
        reactStrictModeLock = false
      })
      .addCase(getPostByUser.fulfilled, (state, action) => {
        state.loading = false
        if (!reactStrictModeLock) {
          state.posts = [...(state.posts || []), ...(action.payload || [])]
          reactStrictModeLock = !reactStrictModeLock
        }
        state.errorMsg = null
      })
      .addCase(getPostByUser.rejected, (state, action) => {
        state.loading = false
        state.posts = null
        if (action.error.message) {
          state.errorMsg = action.error.message
        }
      })
  },
})
export const { postCleared } = postSlice.actions
export default postSlice.reducer
