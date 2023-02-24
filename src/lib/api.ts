import axios from 'axios'
import storage from '../utils/storage'

// 基础配置
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(config => {
  const token = storage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
api.interceptors.response.use(
  response => {
    return Promise.resolve(response.data)
  },
  error => {
    // 使用从服务器返回的错误消息，如果服务器没有响应则返回指定的错误（无法连接服务器）
    return Promise.reject({
      code: error?.response?.data?.code || 500,
      message: error?.response?.data?.message || '无法连接到服务器！',
    })
  }
)

export default api
