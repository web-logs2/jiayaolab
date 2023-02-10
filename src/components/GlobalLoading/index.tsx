import { Spin } from 'antd'
import { FC } from 'react'
import classes from './index.module.less'

/**
 * 目前仅用于首屏加载
 */
const GlobalLoading: FC = () => (
  <div className={classes.loadingWrapper}>
    <Spin size="large" />
  </div>
)

export default GlobalLoading
