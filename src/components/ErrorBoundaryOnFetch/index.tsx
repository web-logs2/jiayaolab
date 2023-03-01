import { Result } from 'antd'
import { FC } from 'react'

/**
 * 资源获取失败
 * @param errorMsg 错误信息
 */
const ErrorBoundaryOnFetch: FC<{
  errorMsg: string | null
}> = ({ errorMsg }) => (
  <Result
    status="error"
    title="发生错误！"
    subTitle={errorMsg}
    style={{ paddingBlockStart: 50 }}
  />
)

export default ErrorBoundaryOnFetch
