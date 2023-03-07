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
): Promise<ResponseModelType<{ token: string; userId: string }>> => {
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
): Promise<ResponseModelType<{ token: string; userId: string }>> => {
  return await api.post('/user/session', { email, password })
}

/**
 * 用户验证
 */
export const verifyToken = async (): Promise<
  ResponseModelType<{ userId: string }>
> => {
  return await api.post('/user/session/verify')
}

/**
 * 获取用户信息
 * @param userId 用户id
 */
export const fetchUserInfo = async (
  userId: string
): Promise<ResponseModelType<UserType>> => {
  return await api.get('/user/info', {
    params: { userId },
  })
}

/**
 * 更新用户信息
 * @param username 用户名
 * @param bio 用户简介
 */
export const updateUserInfo = async (
  username: string,
  bio: string | null
): Promise<ResponseModelType<UserType>> => {
  return await api.post('/user/update', { username, bio })
}
