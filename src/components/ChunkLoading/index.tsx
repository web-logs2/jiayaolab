import { Spin } from 'antd'
import { FC } from 'react'
import classes from './index.module.less'

const ChunkLoading: FC = () => {
  return (
    <div className={classes.chunkLoading}>
      <Spin />
    </div>
  )
}

export default ChunkLoading
