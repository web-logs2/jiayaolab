/**
 * 帖子类型
 */
export interface PostModelType {
  // 帖子ID
  uuid: string
  // 帖子标题
  title: string
  // 帖子内容
  content: string
  // 帖子创建时间
  createdAt: string
  // 帖子更新时间
  updatedAt: string
  // 公开访问
  publicly: boolean
}
