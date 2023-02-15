import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const DRAFT_FEATURE_KEY = 'draft'
const initialState: {
  title: string
  text: string
  html: string
} = {
  title: '',
  text: '',
  html: '',
}

const draftSlice = createSlice({
  name: DRAFT_FEATURE_KEY,
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
  },
})
export const { addTitleDraft, addContentDraft, removeDraft } =
  draftSlice.actions
export default draftSlice.reducer
