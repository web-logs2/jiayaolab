import axios from 'axios'

// 基础配置
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.response.use(
  response => {
    return Promise.resolve(response.data)
  },
  error => {
    // 使用从服务器返回的错误消息，如果服务器没有响应则返回指定的错误（无法连接服务器）
    return Promise.reject(
      error?.response?.data
        ? error.response.data.message
        : 'ERR_CONNECTION_REFUSED'
    )
  }
)

export default api
