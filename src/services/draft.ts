import myAxios from '../lib/myAxios'
import { DraftModuleType } from '../models/draft'
import { ResponseModelType } from '../models/response'

/**
 * 保存草稿
 * @param draftId 草稿的id，没有则新建一个草稿
 * @param title 草稿标题
 * @param tags 草稿标签
 * @param text 草稿文本内容
 * @param html 草稿html格式内容
 * @param _private 草稿仅自己可见
 */
export const saveDraft = async ({
  draftId,
  title,
  tags,
  text,
  html,
  _private,
}: {
  draftId: string | null
  title: string
  tags: string[]
  text: string
  html: string
  _private: boolean
}): Promise<ResponseModelType<{ draftId: string }>> => {
  return await myAxios.post('/draft/save', {
    draftId,
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
export const listAllByDraft = async (): Promise<
  ResponseModelType<DraftModuleType[]>
> => {
  return await myAxios.get('/draft/list')
}

/**
 * 删除草稿
 * @param draftId 草稿的id
 */
export const removeDraftById = async (
  draftId: string
): Promise<ResponseModelType<null>> => {
  return await myAxios.delete('/draft/remove', { params: { draftId } })
}
