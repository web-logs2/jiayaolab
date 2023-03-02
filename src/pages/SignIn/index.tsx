import {
  App as AntdApp,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Typography,
} from 'antd'
import { SHA256 } from 'crypto-js'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import HeadTitle from '../../components/HeadTitle'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { loginUser } from '../../services/user'
import { setLoginUserId, setToken } from '../../store/features/accountSlice'
import classes from './index.module.less'

const key = 'SignIn'
const { Title, Paragraph } = Typography
const SignUp: FC = () => {
  const dispatch = useAppDispatch()
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [logging, setLogging] = useState<boolean>(false)
  const { token } = useTypedSelector(s => s.accountSlice)

  const onFinish = () => {
    setLogging(true)
    message.open({
      key,
      type: 'loading',
      content: '登录中…',
      duration: 0,
    })
    loginUser(email, password)
      .then(res => {
        message.open({
          key,
          type: 'success',
          content: res.message,
        })
        navigate(params.get('redirect') || '/', { replace: true })
        // 添加token
        dispatch(setToken(res.data.token))
        // 添加当前登录用户
        dispatch(setLoginUserId(res.data.userId))
      })
      .catch(err => {
        message.open({
          key,
          type: 'error',
          content: `登录失败，${err.message}`,
        })
      })
      .finally(() => setLogging(false))
  }

  useEffect(() => {
    if (token) {
      navigate('/')
      message.warning('当前用户已登录，请注销后再访问！')
    }
  }, [token])
  return (
    <>
      <HeadTitle prefix="用户登录" />
      <div className={classes.login}>
        <Card>
          <Title level={3}>用户登录</Title>
          <Divider />
          <Paragraph type="warning">使用你的邮箱和密码登录</Paragraph>
          <Form
            onFinish={onFinish}
            disabled={logging}
            onValuesChange={value => {
              value.email && setEmail(value.email)
              value.password && setPassword(SHA256(value.password).toString())
            }}
            initialValues={{
              email,
              password,
            }}
            scrollToFirstError
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请填写邮箱' },
                { whitespace: true, message: '请填写邮箱' },
                { max: 50, message: '邮箱长度不得大于50个字符' },
                {
                  pattern:
                    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                  message: '邮箱格式不正确',
                },
              ]}
              hasFeedback
            >
              <Input autoFocus maxLength={50} showCount />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请填写密码' },
                { whitespace: true, message: '请填写密码' },
                { min: 8, message: '密码长度不得少于8个字符' },
                { max: 32, message: '密码长度不得大于32个字符' },
              ]}
              hasFeedback
            >
              <Input.Password maxLength={32} showCount />
            </Form.Item>
            <Form.Item className={classes.submit}>
              <Button htmlType="submit" type="primary" loading={logging}>
                {logging ? '登录中…' : '登录'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default SignUp
