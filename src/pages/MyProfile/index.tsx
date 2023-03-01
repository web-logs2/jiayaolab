import {
  App as AntdApp,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Skeleton,
  Space,
  Tabs,
  Typography,
} from 'antd'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeadTitle from '../../components/HeadTitle'
import { useTypedSelector } from '../../hook'
import { ProfileType } from '../../models/profile'
import { fetchMyProfile, updateMyProfile } from '../../services/user'

const key = 'UpdateProfile'
const { Title } = Typography
const MyProfile: FC = () => {
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  const { token } = useTypedSelector(s => s.tokenOnlySlice)
  // 是否正在获取数据库中的资料
  const [loading, setLoading] = useState<boolean>(true)
  // 从服务器获得的个人资料
  const [profile, setProfile] = useState<ProfileType | null>(null)
  // 是否正在更新
  const [updating, setUpdating] = useState<boolean>(false)
  // 新修改的用户名
  const [newUserName, setNewUserName] = useState<string>('')
  // 新修改的简介
  const [newBio, setNewBio] = useState<string | null>(null)
  // 更新个人资料处理函数
  const onFinish = () => {
    setUpdating(true)
    message.open({
      key,
      type: 'loading',
      content: '用户资料更新中…',
      duration: 0,
    })
    updateMyProfile(newUserName, newBio)
      .then(res => {
        message.open({
          key,
          type: 'success',
          content: res.message,
        })
        setProfileHandler(res.data)
      })
      .catch(err => {
        message.open({
          key,
          type: 'error',
          content: `用户资料更新失败，${err.message}`,
        })
      })
      .finally(() => setUpdating(false))
  }
  // 设置个人资料处理函数
  const setProfileHandler = (data: ProfileType) => {
    setProfile({
      email: data.email,
      username: data.username,
      uuid: data.uuid,
      bio: data.bio,
    })
    setNewUserName(data.username)
    setNewBio(data.bio)
  }

  // 判断用户是否登录
  useEffect(() => {
    if (!token) {
      message.error('请先登录！')
      navigate('/', { replace: true })
    }
  }, [token])
  // 获取用户资料
  // 因为能获取到资料必须是已经登录的用户，所以这里不需要处理异常
  useEffect(() => {
    fetchMyProfile()
      .then(({ data }) => setProfileHandler(data))
      .finally(() => setLoading(false))
  }, [])
  return (
    <>
      <HeadTitle prefix="个人中心" />
      <Card>
        <Tabs
          tabPosition="left"
          type="card"
          tabBarGutter={8}
          items={[
            {
              label: '我的资料',
              key: 'myProfile',
              children: (
                <>
                  <Title level={3}>我的资料</Title>
                  <Divider />
                  <Skeleton loading={loading} active>
                    <Form
                      scrollToFirstError
                      autoComplete="off"
                      initialValues={{
                        email: profile?.email,
                        username: profile?.username,
                        uuid: profile?.uuid,
                        bio: profile?.bio,
                      }}
                      onFinish={onFinish}
                    >
                      <Form.Item name="uuid" label="UUID">
                        <Input disabled />
                      </Form.Item>
                      <Form.Item name="email" label="邮箱">
                        <Input disabled />
                      </Form.Item>
                      <Form.Item
                        name="username"
                        label="用户名称"
                        required={false}
                        rules={[
                          { required: true, message: '请填写用户名称' },
                          { whitespace: true, message: '请填写用户名称' },
                        ]}
                      >
                        <Input
                          disabled={loading}
                          showCount
                          maxLength={16}
                          onChange={e => setNewUserName(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        name="bio"
                        label="用户简介"
                        rules={[
                          { whitespace: true, message: '请填写用户简介' },
                        ]}
                      >
                        <Input
                          disabled={loading}
                          showCount
                          maxLength={60}
                          onChange={e => setNewBio(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Space>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={updating}
                            disabled={
                              profile?.username === newUserName &&
                              profile?.bio === newBio
                            }
                          >
                            更新
                          </Button>
                          <Button type="primary" danger loading={updating}>
                            修改密码
                          </Button>
                        </Space>
                      </Form.Item>
                    </Form>
                  </Skeleton>
                </>
              ),
            },
            {
              label: '我的帖子',
              key: 'myPosts',
              children: (
                <>
                  <Title level={3}>我的帖子</Title>
                  <Divider />
                  <Skeleton active />
                </>
              ),
            },
          ]}
        />
      </Card>
    </>
  )
}

export default MyProfile
