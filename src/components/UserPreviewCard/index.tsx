import { UserOutlined } from '@ant-design/icons'
import { Avatar, Skeleton, Typography } from 'antd'
import { CSSProperties, FC } from 'react'
import { USER, USER_POST_LIST_ONLY } from '../../constant/paths'
import classes from './index.module.less'

const { Link, Paragraph } = Typography
const UserPreviewCard: FC<{
  size: number | 'small' | 'large' | 'default' | undefined
  paragraph?: CSSProperties
  loading: boolean
  userId?: string
  name?: string
}> = ({ size, paragraph, loading, userId, name }) => {
  const href = `${USER}/${userId}/${USER_POST_LIST_ONLY}`

  return (
    <div className={classes.userPreviewCard}>
      {loading ? (
        <Skeleton.Avatar active size={size} />
      ) : (
        <Link href={href} target="_blank" disabled={!userId}>
          <Avatar size={size} icon={<UserOutlined />} draggable={false} />
        </Link>
      )}
      <Skeleton
        active
        loading={loading}
        paragraph={false}
        title={{ className: classes.usernameLoading }}
      >
        <Link
          href={href}
          target="_blank"
          className={classes.username}
          disabled={!userId}
        >
          <Paragraph
            title={name}
            style={{ ...paragraph, marginBlockEnd: 0 }}
            ellipsis={{ rows: 1 }}
          >
            {name}
          </Paragraph>
        </Link>
      </Skeleton>
    </div>
  )
}

export default UserPreviewCard
