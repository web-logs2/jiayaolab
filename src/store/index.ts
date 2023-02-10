import { combineReducers, configureStore } from '@reduxjs/toolkit'
import postSlice from './features/postSlice'

const reducer = combineReducers({
  postSlice,
})
const store = configureStore({
  reducer,
  devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
