import api from '../lib/api'
import { ResponseModelType } from '../models/response'

/**
 * 用户注册
 * @param email 邮箱
 * @param password 加密后的密码
 */
export const registerUser = async (
  email: string,
  password: string
): Promise<ResponseModelType<{ token: string }>> => {
  return await api.post('/user/add', { email, password })
}

/**
 * 用户登录
 * @param email 邮箱
 * @param password 加密后的密码
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<ResponseModelType<{ token: string }>> => {
  return await api.post('/user/session', { email, password })
}
