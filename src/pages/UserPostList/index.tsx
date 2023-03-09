import { FC } from 'react'
import { useOutletContext } from 'react-router-dom'
import PostPreviewList from '../../components/PostPreviewList'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { getPostByUser } from '../../store/features/postSlice'

const UserPostList: FC = () => {
  const dispatch = useAppDispatch()
  const { size } = useTypedSelector(s => s.postSlice)
  const userId = useOutletContext<string>()

  return (
    <PostPreviewList
      fetchPostHandler={() => dispatch(getPostByUser({ userId, size }))}
    />
  )
}

export default UserPostList
