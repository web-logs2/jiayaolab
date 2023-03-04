import { CommentOutlined, EditOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Row, Skeleton, Space, Typography } from 'antd'
import { FC, Suspense, useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import ChunkLoading from '../../components/ChunkLoading'
import ErrorBoundaryOnFetch from '../../components/ErrorBoundaryOnFetch'
import HeadTitle from '../../components/HeadTitle'
import IconText from '../../components/IconText'
import {
  USER,
  USER_COMMENT_LIST_ONLY,
  USER_LOGIN,
  USER_POST_LIST_ONLY,
} from '../../constant/paths'
import { useTypedSelector } from '../../hook'
import { UserType } from '../../models/user'
import { fetchUserInfo } from '../../services/user'
import classes from './index.module.less'

const { Title, Paragraph } = Typography
const UserInfo: FC = () => {
  const navigate = useNavigate()
  const { loginUserId } = useTypedSelector(s => s.userSlice)
  const { userId } = useParams<{ userId: string }>()
  const [userInfo, setUserInfo] = useState<UserType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  // 获得用户信息处理程序
  const fetchUserInfoHandler = (userId: string) => {
    // 解决在页面不刷新的前提下，第二次点击不会显示加载中组件
    // 确保userId改变后，可以重新显示加载中组件
    setLoading(true)
    // 如果有错误信息就要先清空错误信息，防止在页面不刷新的前提下
    // 切换到其他用户，即使用户信息已经获取到了，依然会出现之前的错误
    errorMsg && setErrorMsg(null)
    fetchUserInfo(userId)
      .then(({ data }) => {
        // 设置用户信息
        setUserInfo({ ...data })
      })
      .catch(err => {
        // 设置错误信息
        setErrorMsg(err.message)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // 传递了userId参数
    if (userId) {
      fetchUserInfoHandler(userId)
    } else {
      // 没有传递userId参数，但是用户登录了，则重定向到当前登录用户的用户帖子列表界面
      if (loginUserId) {
        navigate(`${USER}/${loginUserId}/${USER_POST_LIST_ONLY}`, {
          replace: true,
        })
      } else {
        // 没有传递userId参数，也没有登录，则重定向到登录页面
        navigate(USER_LOGIN, { replace: true })
      }
    }
  }, [userId])
  return loading ? (
    <Card>
      <HeadTitle prefix="用户信息" />
      <Skeleton active paragraph={{ style: { marginBlockEnd: 0 } }} />
    </Card>
  ) : errorMsg || !userInfo ? (
    <ErrorBoundaryOnFetch errorMsg={errorMsg} />
  ) : (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          <HeadTitle prefix={userInfo.username} />
          <div className={classes.userInfoLayout}>
            <Avatar size={128} icon={<UserOutlined />} />
            <div className={classes.userInfo}>
              <Title
                level={2}
                ellipsis={{ rows: 1 }}
                style={{ marginBlockEnd: 0 }}
              >
                {userInfo.username}
              </Title>
              <Paragraph type="secondary">{userInfo.uuid}</Paragraph>
              <Paragraph style={{ marginBlockEnd: 0 }}>
                {userInfo.bio}
              </Paragraph>
            </div>
          </div>
        </Card>
      </Col>
      <Col span={5}>
        <Card>
          <Space direction="vertical">
            <NavLink
              className={({ isActive }) => {
                return isActive ? classes.userInfoList : undefined
              }}
              to={USER_POST_LIST_ONLY}
            >
              <IconText icon={<EditOutlined />} text="发帖" />
            </NavLink>
            <NavLink
              className={({ isActive }) => {
                return isActive ? classes.userInfoList : undefined
              }}
              to={USER_COMMENT_LIST_ONLY}
            >
              <IconText icon={<CommentOutlined />} text="评论" />
            </NavLink>
          </Space>
        </Card>
      </Col>
      <Col span={19}>
        <Card>
          <Suspense fallback={<ChunkLoading />}>
            <Outlet />
          </Suspense>
        </Card>
      </Col>
    </Row>
  )
}

export default UserInfo
