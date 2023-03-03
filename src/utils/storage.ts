const tokenKey = '__jy_jwt__'
const loginUserIdKey = '__jy_user__'
const setToken = (token: string) => {
  window.localStorage.setItem(tokenKey, token)
}
const getToken = () => {
  return window.localStorage.getItem(tokenKey)
}
const removeToken = () => {
  window.localStorage.removeItem(tokenKey)
}
const setLoginUserId = (userId: string) => {
  window.localStorage.setItem(loginUserIdKey, userId)
}
const getLoginUserId = () => {
  return window.localStorage.getItem(loginUserIdKey)
}
const removeLoginUserId = () => {
  window.localStorage.removeItem(loginUserIdKey)
}

export default {
  setToken,
  getToken,
  removeToken,
  setLoginUserId,
  getLoginUserId,
  removeLoginUserId,
}
