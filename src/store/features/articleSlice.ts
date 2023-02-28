import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const titleKey = 'article_title'
const textKey = 'article_text'
const htmlKey = 'article_html'
const initialState: {
  pushing: boolean
  title: string
  text: string
  html: string
} = {
  pushing: false,
  title: window.localStorage.getItem(titleKey) || '',
  text: window.localStorage.getItem(textKey) || '',
  html: window.localStorage.getItem(htmlKey) || '',
}

const articleSlice = createSlice({
  name: 'article',
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
      { payload }: PayloadAction<{ text: string; html: string }>
    ) => {
      state.text = payload.text
      state.html = payload.html
      window.localStorage.setItem(textKey, payload.text)
      window.localStorage.setItem(htmlKey, payload.html)
    },
    // 设置发布状态
    setPushing: (state, { payload }: PayloadAction<boolean>) => {
      state.pushing = payload
    },
    // 移除所有草稿
    removeDraft: state => {
      state.title = state.text = state.html = ''
      ;((...rest) => {
        for (const key of rest) {
          window.localStorage.removeItem(key)
        }
      })(titleKey, textKey, htmlKey)
    },
  },
})
export const { setTitleDraft, setContentDraft, setPushing, removeDraft } =
  articleSlice.actions
export default articleSlice.reducer
