import { UserType } from './user'

/**
 * 帖子类型
 */
export interface PostModelType {
  // 帖子ID
  uuid: string
  // 帖子标题
  title: string
  // 帖子原始内容
  text: string
  // 帖子HTML内容
  html: string
  // 帖子创建时间
  createdAt: string
  // 帖子更新时间
  updatedAt: string
  // 用户信息
  user: UserType
}
