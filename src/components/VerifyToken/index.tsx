import { App as AntdApp } from 'antd'
import { useEffect } from 'react'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { getUserIdByToken } from '../../services/user'
import { logout } from '../../store/features/userSlice'

/**
 * 验证token是否有效
 */
const VerifyToken = () => {
  const { message } = AntdApp.useApp()
  const dispatch = useAppDispatch()
  const { token, loginUserId } = useTypedSelector(s => s.userSlice)

  useEffect(() => {
    if (token) {
      getUserIdByToken()
        .then(({ data }) => {
          // 判断验证成功后的用户id是否匹配本地存储中的用户id
          if (data.userId !== loginUserId) {
            dispatch(logout())
          }
        })
        .catch(err => {
          // 验证失败，退出当前登录状态，要求重新登录
          dispatch(logout())
          message.error(err.message)
        })
    }
  }, [token])
  return null
}

export default VerifyToken
