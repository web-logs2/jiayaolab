import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: {
  token: string | null
} = {
  token: window.localStorage.getItem('jwt_token') || null,
}

const tokenOnlySlice = createSlice({
  name: 'tokenOnlySlice',
  initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload
      window.localStorage.setItem('jwt_token', payload)
    },
    removeToken: state => {
      state.token = null
      window.localStorage.removeItem('jwt_token')
    },
  },
})
export const { setToken, removeToken } = tokenOnlySlice.actions
export default tokenOnlySlice.reducer
