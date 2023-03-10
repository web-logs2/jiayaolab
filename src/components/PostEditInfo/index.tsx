import { Divider, Typography } from 'antd'
import { FC } from 'react'
import { PostModelType } from '../../models/post'
import TimelineDetail from '../TimelineDetail'
import classes from './index.module.less'

const { Paragraph, Text } = Typography
const PostEditInfo: FC<{ post: PostModelType | null }> = ({ post }) => {
  return (
    <Paragraph className={classes.postEditInfo}>
      <Text type="secondary">
        帖子发表：
        <TimelineDetail date={post?.createdAt} placement="bottom" />
      </Text>
      {post?.createdAt !== post?.updatedAt && (
        <>
          <Divider type="vertical" />
          <Text type="secondary">
            最后编辑：
            <TimelineDetail date={post?.updatedAt} placement="bottom" />
          </Text>
        </>
      )}
    </Paragraph>
  )
}

export default PostEditInfo
