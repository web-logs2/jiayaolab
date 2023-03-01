import api from '../lib/api'
import { ResponseModelType } from '../models/response'
import { UserType } from '../models/user'

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

/**
 * 用户验证
 */
export const verityToken = async (): Promise<ResponseModelType<null>> => {
  return await api.post('/user/session/verity')
}

/**
 * 获取用户资料
 */
export const fetchUserProfile = async (): Promise<
  ResponseModelType<UserType>
> => {
  return await api.get('/profile/get')
}

/**
 * 更新用户资料
 */
export const updateUserProfile = async (
  username: string,
  bio: string | null
): Promise<ResponseModelType<UserType>> => {
  return await api.post('/profile/update', { username, bio })
}
