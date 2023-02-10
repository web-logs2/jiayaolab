/**
 * 响应类型
 */
export interface ResponseModelType<T> {
  code: number
  data: T
  message: string
}
