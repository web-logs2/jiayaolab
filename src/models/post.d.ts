/**
 * 帖子类型
 */
export interface PostModelType {
  // 用户ID
  authorId: number
  // 帖子内容
  content: string
  // 帖子创建时间
  createdAt: string
  // 帖子ID
  id: number
  // 是否可见
  published: boolean
  // 帖子标题
  title: string
  // 帖子更新时间
  updatedAt: string
  // 帖子浏览数量
  viewCount: number
}
