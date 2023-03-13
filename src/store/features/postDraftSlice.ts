import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const titleKey = 'post_draft_title'
const textKey = 'post_draft_text'
const htmlKey = 'post_draft_html'
const initialState: {
  pushing: boolean
  title: string
  textContent: string
  htmlContent: string
} = {
  pushing: false,
  title: window.localStorage.getItem(titleKey) || '',
  textContent: window.localStorage.getItem(textKey) || '',
  htmlContent: window.localStorage.getItem(htmlKey) || '',
}

const postDraftSlice = createSlice({
  name: 'postDraft',
  initialState,
  reducers: {
    // 添加标题草稿
    setTitleDraft: (state, { payload }: PayloadAction<string>) => {
      state.title = payload
      window.localStorage.setItem(titleKey, payload)
    },
    // 添加内容草稿
    setContentDraft: (
      state,
      { payload }: PayloadAction<{ textContent: string; htmlContent: string }>
    ) => {
      state.textContent = payload.textContent
      state.htmlContent = payload.htmlContent
      window.localStorage.setItem(textKey, payload.textContent)
      window.localStorage.setItem(htmlKey, payload.htmlContent)
    },
    // 设置发布状态
    setPushing: (state, { payload }: PayloadAction<boolean>) => {
      state.pushing = payload
    },
    // 移除所有草稿
    removeDraft: state => {
      state.title = state.textContent = state.htmlContent = ''
      ;((...rest) => {
        for (const key of rest) {
          window.localStorage.removeItem(key)
        }
      })(titleKey, textKey, htmlKey)
    },
  },
})
export const { setTitleDraft, setContentDraft, setPushing, removeDraft } =
  postDraftSlice.actions
export default postDraftSlice.reducer
