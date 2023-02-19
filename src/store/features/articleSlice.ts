import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: {
  pushing: boolean
  title: string
  text: string
  html: string
} = {
  pushing: false,
  title: '',
  text: '',
  html: '',
}

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    // 添加标题草稿
    addTitleDraft: (state, { payload }: PayloadAction<{ title: string }>) => {
      state.title = payload.title
    },
    // 添加内容草稿
    addContentDraft: (
      state,
      { payload }: PayloadAction<{ text: string; html: string }>
    ) => {
      state.text = payload.text
      state.html = payload.html
    },
    // 移除所有草稿
    removeDraft: state => {
      state.title = state.text = state.html = ''
    },
    // 设置发布状态
    setPush: (state, { payload }: PayloadAction<{ value: boolean }>) => {
      state.pushing = payload.value
    },
  },
})
export const { addTitleDraft, addContentDraft, removeDraft, setPush } =
  articleSlice.actions
export default articleSlice.reducer
