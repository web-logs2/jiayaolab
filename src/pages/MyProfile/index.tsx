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
import { fetchMyProfile } from '../../services/user'
import classes from './index.module.less'

const { Title } = Typography
const MyProfile: FC = () => {
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  const { token } = useTypedSelector(s => s.tokenOnlySlice)
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!token) {
      message.error('请先登录！')
      navigate('/', { replace: true })
    }
  }, [token])
  useEffect(() => {
    fetchMyProfile()
      .then(({ data }) => {
        setProfile({
          email: data.email,
          username: data.username,
          uuid: data.uuid,
          bio: data.bio,
        })
      })
      .catch(reason => {
        console.log(reason.message)
      })
      .finally(() => setLoading(false))
  }, [])
  return (
    <>
      <HeadTitle prefix="个人中心" />
      <Card className={classes.myProfile}>
        <Tabs
          tabPosition="left"
          type="card"
          tabBarGutter={8}
          destroyInactiveTabPane
          items={[
            {
              label: '我的资料',
              key: 'myProfile',
              children: (
                <>
                  <Title level={3}>我的资料</Title>
                  <Divider />
                  <Skeleton loading={loading}>
                    <Form
                      scrollToFirstError
                      autoComplete="off"
                      initialValues={{
                        email: profile?.email,
                        username: profile?.username,
                        uuid: profile?.uuid,
                        bio: profile?.bio,
                      }}
                      onValuesChange={e => {
                        console.log(e)
                      }}
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
                        <Input disabled={loading} showCount maxLength={16} />
                      </Form.Item>
                      <Form.Item
                        name="bio"
                        label="用户简介"
                        rules={[
                          { whitespace: true, message: '请填写用户简介' },
                        ]}
                      >
                        <Input disabled={loading} showCount maxLength={60} />
                      </Form.Item>
                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit">
                            更新
                          </Button>
                          <Button type="primary" danger>
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
