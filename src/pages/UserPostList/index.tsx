import { FC } from 'react'
import { useOutletContext } from 'react-router-dom'
import PostPreviewList from '../../components/PostPreviewList'
import { useAppDispatch } from '../../hook'
import { getPostByUser } from '../../store/features/postSlice'

const UserPostList: FC = () => {
  const dispatch = useAppDispatch()
  const userId = useOutletContext<string>()

  return (
    <PostPreviewList fetchPostHandler={() => dispatch(getPostByUser(userId))} />
  )
}

export default UserPostList
