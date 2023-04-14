import { Tag } from 'antd'
import { FC } from 'react'
import classes from './index.module.less'

/**
 * 帖子标签列表
 * @param tags 标签列表
 */
const TagList: FC<{ tags: string[] }> = ({ tags }) => {
  return (
    <div className={classes.tagList}>
      {tags.map(tag => (
        <Tag key={tag} title={tag}>
          {tag}
        </Tag>
      ))}
    </div>
  )
}

export default TagList
