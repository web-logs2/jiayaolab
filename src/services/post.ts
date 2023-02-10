import api from '../lib/api'
import { OrderByModuleType } from '../models/orderBy'
import { PostModelType } from '../models/post'
import { ResponseModelType } from '../models/response'

/**
 * 根据类别获取帖子
 * @param current 当前帖子大小
 * @param sortField 根据依据
 */
export const fetchPostByCategories = async (
  current: string | number,
  sortField: keyof PostModelType
): Promise<ResponseModelType<PostModelType[] | null>> => {
  return await api.get('/post/category', {
    params: { current, sortField },
  })
}

/**
 * 根据搜索关键词获取帖子
 * @param current 当前帖子大小
 * @param sortField 根据依据
 * @param sortOrder 排序方式
 * @param keywords 关键字
 */
export const fetchPostByConditions = async (
  current: string | number,
  sortField: keyof PostModelType,
  sortOrder: OrderByModuleType,
  keywords: string
): Promise<ResponseModelType<PostModelType[] | null>> => {
  return await api.get('/post/condition', {
    params: {
      current,
      sortField,
      sortOrder,
      keywords,
    },
  })
}

/**
 * 发布帖子
 * @param title 帖子标题
 * @param content 帖子内容
 * @param publicly 是否公开
 */
export const publishingPost = async (
  title: string,
  content: string,
  publicly: boolean
): Promise<ResponseModelType<string>> => {
  return await api.post('/post', {
    title,
    content,
    published: publicly,
  })
}

/**
 * 获取指定ID的帖子
 * @param id 帖子的ID
 */
export const fetchPostById = async (
  id: string | number
): Promise<ResponseModelType<PostModelType>> => {
  return await api.get('/post/detail', {
    params: { id },
  })
}
