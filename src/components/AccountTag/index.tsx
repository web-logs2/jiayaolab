import { UserOutlined } from '@ant-design/icons'
import { Avatar, Skeleton, Typography } from 'antd'
import { CSSProperties, FC } from 'react'
import { USER } from '../../constant/paths'
import classes from './index.module.less'

const { Link, Paragraph } = Typography
const AccountTag: FC<{
  size: number | 'small' | 'large' | 'default' | undefined
  paragraph?: CSSProperties
  loading: boolean
  userId: string
  name: string
}> = ({ size, paragraph, loading, userId, name }) => {
  return (
    <div className={classes.accountTag}>
      {loading ? (
        <Skeleton.Avatar active size={size} />
      ) : (
        <Link href={`${USER}/${userId}`} target="_blank">
          <Avatar size={size} icon={<UserOutlined />} draggable={false} />
        </Link>
      )}
      <Skeleton
        active
        loading={loading}
        paragraph={false}
        title={{ className: classes.accountNameLoading }}
      >
        <Link
          href={`${USER}/${userId}`}
          target="_blank"
          className={classes.accountName}
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

export default AccountTag
