import { Result } from 'antd'
import { FC } from 'react'
import classes from './index.module.less'

/**
 * 资源获取失败
 * @param errorMsg 错误信息
 */
const FetchFailed: FC<{
  errorMsg: string | null
}> = ({ errorMsg }) => (
  <Result
    status="error"
    title="FAILED"
    subTitle={errorMsg}
    className={classes.failedResult}
  />
)

export default FetchFailed
