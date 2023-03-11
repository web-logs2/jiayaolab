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
import { registerUser } from '../../services/user'
import { setLoginUserId, setToken } from '../../store/features/userSlice'
import classes from './index.module.less'

const key = 'SignUp'
const { Title, Paragraph } = Typography
const SignUp: FC = () => {
  const dispatch = useAppDispatch()
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [registering, setRegistering] = useState<boolean>(false)
  const { token } = useTypedSelector(s => s.userSlice)

  const onFinish = () => {
    setRegistering(true)
    message.open({
      key,
      type: 'loading',
      content: '注册中…',
      duration: 0,
    })
    registerUser(email, password)
      .then(res => {
        message.open({
          key,
          type: 'success',
          content: res.message,
        })
        // 重定向到之前到页面
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
          content: `注册失败，${err.message}`,
        })
      })
      .finally(() => setRegistering(false))
  }

  useEffect(() => {
    if (token) {
      navigate('/')
      message.warning('请先退出登录！')
    }
  }, [token])
  return (
    <>
      <HeadTitle layers={['用户注册']} />
      <div className={classes.register}>
        <Card>
          <Title level={3}>用户注册</Title>
          <Divider />
          <Paragraph type="warning">
            用户密码通过SHA256散列算法加密存储在数据库
          </Paragraph>
          <Paragraph type="warning">
            请注意不要使用简单的密码，那样是不安全的，虽然SHA256散列算法非常强大，但还是会有被破解的可能。
          </Paragraph>
          <Form
            onFinish={onFinish}
            disabled={registering}
            onValuesChange={value => {
              value.email && setEmail(value.email)
              // SHA256加密存储到数据库
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
              colon={false}
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
              colon={false}
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
              <Button htmlType="submit" type="primary" loading={registering}>
                {registering ? '注册中…' : '立即注册'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default SignUp
