import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import storage from '../../utils/storage'

const initialState: {
  token: string | null
} = {
  token: storage.getToken() || null,
}

const tokenOnlySlice = createSlice({
  name: 'tokenOnlySlice',
  initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload
      storage.setToken(payload)
    },
    removeToken: state => {
      state.token = null
      storage.removeToken()
    },
  },
})
export const { setToken, removeToken } = tokenOnlySlice.actions
export default tokenOnlySlice.reducer
