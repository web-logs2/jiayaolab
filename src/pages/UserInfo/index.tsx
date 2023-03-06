import { CommentOutlined, EditOutlined, UserOutlined } from '@ant-design/icons'
import {
  App as AntdApp,
  Avatar,
  Card,
  Col,
  Row,
  Skeleton,
  Typography,
} from 'antd'
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
import { fetchUserInfo, updateUserInfo } from '../../services/user'
import classes from './index.module.less'

const key = 'UpdateUser'
const { Title, Paragraph, Text } = Typography
const UserInfo: FC = () => {
  const navigate = useNavigate()
  const { message } = AntdApp.useApp()
  const { loginUserId } = useTypedSelector(s => s.userSlice)
  const { userId } = useParams<{ userId: string }>()
  // 用户信息
  const [userInfo, setUserInfo] = useState<UserType | null>(null)
  // 用户信息缓存
  const [usernameCache, setUsernameCache] = useState<string | null>(null)
  const [bioCache, setBioCache] = useState<string | null>(null)
  // 获取用户信息中
  const [loading, setLoading] = useState<boolean>(true)
  // 获取用户信息时发生的错误
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  // 获得用户信息处理程序
  const fetchUserInfoHandler = (userId: string) => {
    // 解决在页面不刷新的前提下，第二次点击不会显示加载中组件
    // 确保userId改变后，可以重新显示加载中组件
    setLoading(true)
    // 如果有错误信息就要先清空错误信息，防止在页面不刷新的前提下
    // 切换到其他用户，即使用户信息已经获取到了，依然会出现之前的错误
    errorMsg && setErrorMsg(null)
    // 获取用户信息
    fetchUserInfo(userId)
      .then(({ data }) => {
        // 设置用户信息
        setUserInfo({ ...data })
        // 设置用户信息缓存
        setUsernameCache(data.username)
        setBioCache(data.bio)
      })
      .catch(err => {
        // 设置错误信息
        setErrorMsg(err.message)
      })
      .finally(() => setLoading(false))
  }

  // 更新用户信息
  useEffect(() => {
    // 只有在用户信息发生改变后，改变后的信息与原先的用户信息不一致时才会执行更新用户处理函数
    if (
      usernameCache &&
      (usernameCache !== userInfo?.username || bioCache !== userInfo?.bio)
    ) {
      message.open({
        key,
        type: 'loading',
        content: '更新中…',
        duration: 0,
      })
      // 更新用户信息
      updateUserInfo(usernameCache, bioCache)
        .then(res => {
          message.open({
            key,
            type: 'success',
            content: res.message,
          })
          // 更新完成，返回最新的用户信息
          setUserInfo({ ...res.data })
        })
        .catch(err => {
          // 更新失败，还原到上一次的用户信息
          if (userInfo) {
            setUsernameCache(userInfo.username)
            setBioCache(userInfo.bio)
          }
          message.open({
            key,
            type: 'error',
            content: `更新失败，${err.message}`,
          })
        })
    }
  }, [usernameCache, bioCache])
  useEffect(() => {
    // 传递了userId参数
    if (userId) {
      fetchUserInfoHandler(userId)
    } else if (loginUserId) {
      // 没有传递userId参数，但是用户登录了，则重定向到当前登录用户的用户帖子列表界面
      navigate(`${USER}/${loginUserId}/${USER_POST_LIST_ONLY}`, {
        replace: true,
      })
    } else {
      // 没有传递userId参数，也没有登录，则重定向到登录页面
      navigate(USER_LOGIN, { replace: true })
    }
  }, [userId])
  return (
    <>
      <HeadTitle layers={[userInfo?.username, '用户信息']} />
      {loading ? (
        <Card>
          <Skeleton active paragraph={{ style: { marginBlockEnd: 0 } }} />
        </Card>
      ) : errorMsg || !userInfo ? (
        <ErrorBoundaryOnFetch errorMsg={errorMsg} />
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <div className={classes.userInfoLayout}>
                <Avatar size={128} icon={<UserOutlined />} />
                <div className={classes.userInfo}>
                  <Title
                    level={3}
                    ellipsis={{ rows: 1 }}
                    editable={
                      userInfo.uuid === loginUserId
                        ? {
                            maxLength: 16,
                            tooltip: false,
                            onChange: username => {
                              if (username) {
                                // 只有当输入的用户名不为空时，才会更新用户名
                                setUsernameCache(username)
                              } else {
                                message.open({
                                  key,
                                  type: 'error',
                                  content: '用户名不能为空！',
                                })
                              }
                            },
                          }
                        : false
                    }
                    style={{ marginBlockEnd: 0 }}
                  >
                    {usernameCache}
                  </Title>
                  <Paragraph type="secondary">{userInfo.uuid}</Paragraph>
                  <Paragraph
                    editable={
                      userInfo.uuid === loginUserId
                        ? {
                            maxLength: 60,
                            tooltip: false,
                            onChange: bio => setBioCache(bio || null),
                          }
                        : false
                    }
                    style={{ marginBlockEnd: 0 }}
                  >
                    {bioCache ||
                      (userInfo.uuid === loginUserId ? (
                        <Text type="secondary">暂无简介</Text>
                      ) : null)}
                  </Paragraph>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <NavLink to={USER_POST_LIST_ONLY}>
                <Paragraph>
                  <IconText
                    icon={<EditOutlined />}
                    text={`${
                      userInfo.uuid === loginUserId ? '我的' : 'TA的'
                    }发帖`}
                  />
                </Paragraph>
              </NavLink>
              <NavLink to={USER_COMMENT_LIST_ONLY}>
                <Paragraph style={{ marginBlockEnd: 0 }}>
                  <IconText
                    icon={<CommentOutlined />}
                    text={`${
                      userInfo.uuid === loginUserId ? '我的' : 'TA的'
                    }评论`}
                  />
                </Paragraph>
              </NavLink>
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
      )}
    </>
  )
}

export default UserInfo
