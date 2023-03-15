import { FC } from 'react'
import { useOutletContext } from 'react-router-dom'
import PostPreviewList from '../../components/PostPreviewList'
import { useAppDispatch } from '../../hook'
import { findPostByUserHandler } from '../../store/features/postSlice'

const UserPostList: FC = () => {
  const dispatch = useAppDispatch()
  const userId = useOutletContext<string>()

  return (
    <PostPreviewList
      fetchPostHandler={() => dispatch(findPostByUserHandler(userId))}
    />
  )
}

export default UserPostList
