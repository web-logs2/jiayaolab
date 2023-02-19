import api from '../lib/api'
import { OrderByModuleType } from '../models/orderBy'
import { PostModelType } from '../models/post'
import { ResponseModelType } from '../models/response'

/**
 * 获取主页所需帖子
 * @param current 当前帖子大小
 * @param sortField 根据依据
 */
export const fetchPostByCategories = async (
  current: string | number,
  sortField: keyof PostModelType
): Promise<ResponseModelType<PostModelType[] | null>> => {
  return await api.get('/post/get', {
    params: { type: 'main', current, sortField },
  })
}

/**
 * 获取帖子概览页面所需帖子
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
 * 发布帖子
 * @param title 帖子标题
 * @param text 帖子原始内容
 * @param html 帖子HTML内容
 * @param publicly 是否公开访问
 */
export const pushPost = async (
  title: string,
  text: string,
  html: string,
  publicly: boolean
): Promise<ResponseModelType<string>> => {
  return await api.post('/post/add', {
    title: title.trim(),
    text,
    html,
    publicly,
  })
}

/**
 * 获取帖子详情
 * @param id 帖子ID
 */
export const fetchPostById = async (
  id: string | number
): Promise<ResponseModelType<PostModelType>> => {
  return await api.get('/post/get', {
    params: { id, type: 'detail' },
  })
}
