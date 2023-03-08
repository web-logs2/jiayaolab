import { Card, Divider, Typography } from 'antd'
import { FC } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useTypedSelector } from '../../hook'

const { Title } = Typography
const UserCommentList: FC = () => {
  const userId = useOutletContext<string>()
  const { loginUserId } = useTypedSelector(s => s.userSlice)

  return (
    <Card>
      <Title level={3}>{`${
        userId === loginUserId ? '我的' : 'TA的'
      }评论`}</Title>
      <Divider />
    </Card>
  )
}

export default UserCommentList
