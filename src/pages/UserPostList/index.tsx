import { Card, Divider, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import PostPreviewList from '../../components/PostPreviewList'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { getPostByUser, postCleared } from '../../store/features/postSlice'

const { Title } = Typography
const UserPostList: FC = () => {
  const dispatch = useAppDispatch()
  const { posts } = useTypedSelector(s => s.postSlice)
  const { loginUserId } = useTypedSelector(s => s.userSlice)
  const [size, setSize] = useState<number>(1)
  const userId = useOutletContext<string>()

  // 加载用户帖子列表
  useEffect(() => {
    if (posts) {
      dispatch(postCleared())
    }
    if (userId) {
      dispatch(getPostByUser({ userId, size }))
    }
  }, [])
  // 当size改变时加载更多用户帖子
  useEffect(() => {
    dispatch(getPostByUser({ userId, size }))
  }, [size])
  return (
    <Card>
      <Title level={3}>{`${
        userId === loginUserId ? '我的' : 'TA的'
      }发帖`}</Title>
      <Divider />
      <PostPreviewList
        size={size}
        loadMoreHandler={() => setSize(size + 1)}
        userInfo={false}
        compact
      />
    </Card>
  )
}

export default UserPostList
