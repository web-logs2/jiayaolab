import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import storage from '../../utils/storage'

const initialState: {
  token: string | null
  loginUserId: string | null
} = {
  token: storage.getToken() || null,
  loginUserId: storage.getLoginUserId() || null,
}

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    // 登录成功，设置用户token
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload
      storage.setToken(payload)
    },
    // 登录成功，设置已登录用户的userId
    setLoginUserId: (state, { payload }: PayloadAction<string>) => {
      state.loginUserId = payload
      storage.setLoginUserId(payload)
    },
    // 退出登录
    logout: state => {
      state.token = null
      state.loginUserId = null
      storage.removeToken()
      storage.removeLoginUserId()
    },
  },
})
export const { setLoginUserId, setToken, logout } = userSlice.actions
export default userSlice.reducer
