import { Card } from 'antd'
import { FC } from 'react'
import { Navigate, useOutletContext } from 'react-router-dom'
import { USER_POST_LIST_ONLY } from '../../constant/paths'
import { useTypedSelector } from '../../hook'

const UserSettings: FC = () => {
  return <Card title="隐私设置"></Card>
}

const UserSettingsWrapper = () => {
  const userId = useOutletContext<string>()
  const { loginUserId } = useTypedSelector(s => s.userSlice)
  // 用户只可以打开自己的设置页面，不允许访问除自己以外所有人的设置页面，重定向到该用户的帖子列表页面
  return userId === loginUserId ? (
    <UserSettings />
  ) : (
    <Navigate to={`../${USER_POST_LIST_ONLY}`} replace />
  )
}

export default UserSettingsWrapper
