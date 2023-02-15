import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const DRAFT_FEATURE_KEY = 'draft'
const initialState: {
  title: string
  content: string
  contentHtml: string
} = {
  // 标题草稿
  title: '',
  // 内容草稿（原始）
  content: '',
  // 内容草稿（HTML格式）
  contentHtml: '',
}

const draftSlice = createSlice({
  name: DRAFT_FEATURE_KEY,
  initialState,
  reducers: {
    addDraft: (state, { payload }: PayloadAction<typeof initialState>) => {
      state.title = payload.title
      state.content = payload.content
      state.contentHtml = payload.contentHtml
    },
    cleanDraft: state => {
      state.title = ''
      state.content = ''
      state.contentHtml = ''
    },
  },
})
export const { addDraft, cleanDraft } = draftSlice.actions
export default draftSlice.reducer
