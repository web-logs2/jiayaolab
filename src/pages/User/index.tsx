import { FC, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { USER, USER_LOGIN } from '../../constant/paths'
import { useTypedSelector } from '../../hook'

const User: FC = () => {
  const navigate = useNavigate()
  const { loginUserId } = useTypedSelector(s => s.userSlice)
  const { userId } = useParams<{ userId: string }>()

  useEffect(() => {
    // 传递了userId参数
    if (userId) {
      console.log('userId', userId)
    } else {
      // 没有传递userId参数，但是用户登录了，则重定向到当前登录用户的界面
      if (loginUserId) {
        navigate(`${USER}/${loginUserId}`, { replace: true })
      } else {
        // 没有传递userId参数，也没有登录，则重定向到登录页面
        navigate(USER_LOGIN, { replace: true })
      }
    }
  }, [userId])
  return <div>{userId}</div>
}

export default User
