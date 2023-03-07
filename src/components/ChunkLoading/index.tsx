import { Spin } from 'antd'
import { FC } from 'react'
import classes from './index.module.less'

/**
 * 页面中组件加载
 */
const ChunkLoading: FC = () => {
  return (
    <div className={classes.chunkLoading}>
      <Spin />
    </div>
  )
}

export default ChunkLoading
