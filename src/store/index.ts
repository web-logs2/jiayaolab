import { combineReducers, configureStore } from '@reduxjs/toolkit'
import articleSlice from './features/articleSlice'
import postSlice from './features/postSlice'
import userSlice from './features/userSlice'

const reducer = combineReducers({
  articleSlice,
  postSlice,
  userSlice,
})
const store = configureStore({
  reducer,
  devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
