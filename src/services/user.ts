import myAxios from '../lib/myAxios'
import { PostModelType } from '../models/post'
import { ResponseModelType } from '../models/response'
import { UserType } from '../models/user'

/**
 * 用户注册
 * @param email 邮箱
 * @param password 加密后的密码
 */
export const saveUserByRegister = async (
  email: string,
  password: string
): Promise<ResponseModelType<{ token: string; userId: string }>> => {
  return await myAxios.post('/user/add', { email, password })
}

/**
 * 用户登录
 * @param email 邮箱
 * @param password 加密后的密码
 */
export const saveUserByLogin = async (
  email: string,
  password: string
): Promise<ResponseModelType<{ token: string; userId: string }>> => {
  return await myAxios.post('/user/session', { email, password })
}

/**
 * 用户验证
 */
export const getUserIdByToken = async (): Promise<
  ResponseModelType<{ userId: string }>
> => {
  return await myAxios.post('/user/session/verify')
}

/**
 * 获取用户信息
 * @param userId 用户id
 */
export const getUserInfoById = async (
  userId: string
): Promise<ResponseModelType<UserType>> => {
  return await myAxios.get('/user/info', {
    params: { userId },
  })
}

/**
 * 更新用户信息
 * @param userId 更新用户的id
 * @param username 用户名
 * @param bio 用户简介
 */
export const updateUserInfo = async (
  userId: string,
  username: string,
  bio: string | null
): Promise<ResponseModelType<UserType>> => {
  return await myAxios.post('/user/update', { userId, username, bio })
}

/**
 * 获取用户帖子列表
 * @param userId 用户id
 * @param size 当前帖子大小
 */
export const findPostByUser = async (
  userId: string,
  size: string | number
): Promise<ResponseModelType<PostModelType[] | null>> => {
  return await myAxios.get('/user/post/list', {
    params: { userId, current: size },
  })
}
