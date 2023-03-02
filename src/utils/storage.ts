const setToken = (token: string) => {
  window.localStorage.setItem('jwt_token', token)
}
const getToken = () => {
  return window.localStorage.getItem('jwt_token')
}
const removeToken = () => {
  window.localStorage.removeItem('jwt_token')
}
const setLoginUserId = (userId: string) => {
  window.localStorage.setItem('login_user_id', userId)
}
const getLoginUserId = () => {
  return window.localStorage.getItem('login_user_id')
}
const removeLoginUserId = () => {
  window.localStorage.removeItem('login_user_id')
}

export default {
  setToken,
  getToken,
  removeToken,
  setLoginUserId,
  getLoginUserId,
  removeLoginUserId,
}
