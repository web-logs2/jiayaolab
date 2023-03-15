import api from '../lib/api'
import { OrderByModuleType } from '../models/orderBy'
import { PostModelType } from '../models/post'
import { ResponseModelType } from '../models/response'

/**
 * 获取主页面推荐帖子
 * @param current 当前帖子大小
 * @param sortField 根据依据
 */
export const findByRecommendWithPage = async (
  current: string | number,
  sortField: keyof PostModelType
): Promise<ResponseModelType<PostModelType[] | null>> => {
  return await api.get('/post/recommend', {
    params: { current, sortField },
  })
}

/**
 * 搜索帖子页面帖子
 * @param current 当前帖子大小
 * @param sortField 根据依据
 * @param sortOrder 排序方式
 * @param keywords 搜索关键字
 */
export const findBySearchWithPage = async (
  current: string | number,
  sortField: keyof PostModelType,
  sortOrder: OrderByModuleType,
  keywords: string
): Promise<ResponseModelType<PostModelType[] | null>> => {
  return await api.get('/post/search', {
    params: {
      current,
      sortField,
      sortOrder,
      keywords,
    },
  })
}

/**
 * 获取帖子详情
 * @param postId 帖子id
 */
export const getPostById = async (
  postId: string | number
): Promise<ResponseModelType<PostModelType>> => {
  return await api.get('/post/detail', {
    params: { postId },
  })
}

/**
 * 发布帖子
 * @param title 标题
 * @param tags 标签
 * @param text 文本内容
 * @param html HTML格式内容
 * @param _private 仅自己可见
 * @param draftId 草稿id，如果有则帖子发布完成后删除该草稿
 */
export const savePost = async ({
  title,
  tags,
  text,
  html,
  _private,
  draftId,
}: {
  title: string
  tags: string[]
  text: string
  html: string
  _private: boolean
  draftId: string | null
}): Promise<ResponseModelType<string>> => {
  return await api.post('/post/submit', {
    title: title.trim(),
    tags: tags.join('|'),
    text,
    html,
    _private,
    draftId,
  })
}

/**
 * 删除帖子
 * @param postId 帖子id
 */
export const removePostById = async (
  postId: string
): Promise<ResponseModelType<null>> => {
  return await api.delete('/post/remove', { params: { postId } })
}
