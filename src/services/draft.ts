import api from '../lib/api'
import { DraftModuleType } from '../models/draft'
import { ResponseModelType } from '../models/response'

/**
 * 保存草稿
 * @param uuid 草稿的id，没有则代表新建一个草稿
 * @param title 草稿标题
 * @param tags 草稿标签
 * @param text 草稿文本内容
 * @param html 草稿html格式内容
 * @param _private 草稿仅自己可见
 */
export const savePostDraft = async ({
  uuid,
  title,
  tags,
  text,
  html,
  _private,
}: {
  uuid: string | null
  title: string
  tags: string[]
  text: string
  html: string
  _private: boolean
}): Promise<ResponseModelType<{ draftId: string }>> => {
  return await api.post('/draft/save', {
    uuid,
    title,
    tags,
    text,
    html,
    _private,
  })
}

/**
 * 获取草稿列表
 */
export const getDraftList = async (): Promise<
  ResponseModelType<DraftModuleType[]>
> => {
  return await api.get('/draft/list')
}

/**
 * 删除草稿
 * @param draftId 草稿的id
 */
export const removeDraft = async (
  draftId: string
): Promise<ResponseModelType<null>> => {
  return await api.delete('/draft/remove', { params: { draftId } })
}
