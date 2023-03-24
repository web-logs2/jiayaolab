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

  // 判断是否存在凭证的必要信息
  useEffect(() => {
    if (!(token && loginUserId)) {
      // 清空登录信息，要求重新登录
      dispatch(logout())
    }
  }, [])
  // 验证用户登录凭证
  useEffect(() => {
    if (token) {
      getUserIdByToken()
        .then(({ data }) => {
          // 验证成功不做任何操作，验证失败退出当前登录状态，要求重新登录
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
