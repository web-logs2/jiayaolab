import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const DRAFT_FEATURE_KEY = 'draft'
const initialState: {
  title: string
  content: string
} = {
  // 标题草稿
  title: '',
  // 内容草稿
  content: '',
}

const draftSlice = createSlice({
  name: DRAFT_FEATURE_KEY,
  initialState,
  reducers: {
    addDraft: (
      state,
      {
        payload,
      }: PayloadAction<{
        title: string
        content: string
      }>
    ) => {
      state.title = payload.title
      state.content = payload.content
    },
  },
})
export const { addDraft } = draftSlice.actions
export default draftSlice.reducer
