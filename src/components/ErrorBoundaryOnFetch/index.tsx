import { Result } from 'antd'
import { FC } from 'react'

/**
 * 获取数据范围的错误边界组件
 * @param errorMsg 错误消息
 */
const ErrorBoundaryOnFetch: FC<{
  errorMsg: string | null
}> = ({ errorMsg }) => (
  <Result status="error" title={errorMsg} style={{ paddingBlockStart: 50 }} />
)

export default ErrorBoundaryOnFetch
