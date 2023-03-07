import { UserOutlined } from '@ant-design/icons'
import { Avatar, Skeleton, Typography } from 'antd'
import { CSSProperties, FC } from 'react'
import { USER, USER_POST_LIST_ONLY } from '../../constant/paths'
import classes from './index.module.less'

const { Link, Paragraph } = Typography
/**
 * 预览用户信息卡片组件
 * @param size 用户头像大小
 * @param paragraph 用户名段落设置
 * @param loading 是否正在加载中
 * @param userId 用户id
 * @param name 用户名
 */
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
