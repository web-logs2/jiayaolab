import { Tag } from 'antd'
import { FC } from 'react'
import classes from './index.module.less'

const TagList: FC<{ tags: string[] }> = ({ tags }) => {
  return (
    <div className={classes.tagList}>
      {tags.map(tag => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
  )
}

export default TagList
