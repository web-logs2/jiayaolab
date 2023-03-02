import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import storage from '../../utils/storage'

const initialState: {
  token: string | null
  loginUserId: string | null
} = {
  token: storage.getToken() || null,
  loginUserId: storage.getLoginUserId() || null,
}

const accountSlice = createSlice({
  name: 'accountSlice',
  initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload
      storage.setToken(payload)
    },
    setLoginUserId: (state, { payload }: PayloadAction<string>) => {
      state.loginUserId = payload
      storage.setLoginUserId(payload)
    },
    logout: state => {
      state.token = null
      state.loginUserId = null
      storage.removeToken()
      storage.removeLoginUserId()
    },
  },
})
export const { setLoginUserId, setToken, logout } = accountSlice.actions
export default accountSlice.reducer
