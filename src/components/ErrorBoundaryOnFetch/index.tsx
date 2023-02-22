import { Result } from 'antd'
import { FC } from 'react'
import classes from './index.module.less'

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
    className={classes.result}
  />
)

export default ErrorBoundaryOnFetch
