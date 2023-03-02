import { combineReducers, configureStore } from '@reduxjs/toolkit'
import accountSlice from './features/accountSlice'
import articleSlice from './features/articleSlice'
import postSlice from './features/postSlice'

const reducer = combineReducers({
  postSlice,
  accountSlice,
  articleSlice,
})
const store = configureStore({
  reducer,
  devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
