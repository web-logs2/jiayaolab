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
    setTitleDraft: (state, { payload }: PayloadAction<string>) => {
      state.title = payload
    },
    // 添加内容草稿
    setContentDraft: (
      state,
      { payload }: PayloadAction<{ text: string; html: string }>
    ) => {
      state.text = payload.text
      state.html = payload.html
    },
    // 设置发布状态
    setPushing: (state, { payload }: PayloadAction<boolean>) => {
      state.pushing = payload
    },
    // 移除所有草稿
    removeDraft: state => {
      state.title = state.text = state.html = ''
    },
  },
})
export const { setTitleDraft, setContentDraft, setPushing, removeDraft } =
  articleSlice.actions
export default articleSlice.reducer
