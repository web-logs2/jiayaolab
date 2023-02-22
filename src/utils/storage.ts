const setToken = (token: string) => {
  window.localStorage.setItem('jwt_token', token)
}
const getToken = () => {
  return window.localStorage.getItem('jwt_token')
}
const removeToken = () => {
  window.localStorage.removeItem('jwt_token')
}

export default {
  setToken,
  getToken,
  removeToken,
}
