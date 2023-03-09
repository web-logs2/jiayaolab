import api from '../lib/api'
import { OrderByModuleType } from '../models/orderBy'
import { PostModelType } from '../models/post'
import { ResponseModelType } from '../models/response'

/**
 * 获取主页面推荐帖子
 * @param current 当前帖子大小
 * @param sortField 根据依据
 */
export const fetchRecommendPostList = async (
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
export const fetchSearchPostList = async (
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
 * @param id 帖子id
 */
export const fetchPostDetail = async (
  id: string | number
): Promise<ResponseModelType<PostModelType>> => {
  return await api.get('/post/detail', {
    params: { id },
  })
}

/**
 * 发布帖子
 * @param title 帖子标题
 * @param text 帖子原始内容
 * @param html 帖子HTML内容
 * @param _public 公开访问
 */
export const submitPost = async (
  title: string,
  text: string,
  html: string,
  _public: boolean
): Promise<ResponseModelType<string>> => {
  return await api.post('/post/submit', {
    title: title.trim(),
    text,
    html,
    _public,
  })
}
