import { App as AntdApp, Card, Divider, Form, Typography } from 'antd'
import { SHA256 } from 'crypto-js'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import FormEmailItem from '../../components/FormEmailItem'
import FormPasswordItem from '../../components/FormPasswordItem'
import FormUserLayout from '../../components/FormUserLayout'
import FormUserSubmitItem from '../../components/FormUserSubmitItem'
import HeadTitle from '../../components/HeadTitle'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { saveUserByLogin } from '../../services/user'
import { setLoginUserId, setToken } from '../../store/features/userSlice'

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
  const { token } = useTypedSelector(s => s.userSlice)

  const saveUserByLoginHandler = () => {
    setLogging(true)
    message.open({
      key,
      type: 'loading',
      content: '登录中…',
      duration: 0,
    })
    saveUserByLogin(email, password)
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
          content: `登录失败，${err.message}`,
        })
      })
      .finally(() => setLogging(false))
  }

  useEffect(() => {
    if (token) {
      navigate('/')
      message.error('你已登录，请先退出登录！')
    }
  }, [token])
  return (
    <>
      <HeadTitle layers={['用户登录']} />
      <FormUserLayout>
        <Card>
          <Title level={3}>用户登录</Title>
          <Divider />
          <Paragraph type="warning">使用你的邮箱和密码进行登录</Paragraph>
          <Paragraph type="warning">
            登录成功后，经过服务器数字签名的登录凭证，加密后将会保存在客户端（本地），请不要将你的登录凭证（token）泄露给任何人！
          </Paragraph>
          <Form
            onFinish={saveUserByLoginHandler}
            disabled={logging}
            onValuesChange={changedValues => {
              changedValues.email && setEmail(changedValues.email)
              changedValues.password &&
                setPassword(SHA256(changedValues.password).toString())
            }}
            initialValues={{
              email,
              password,
            }}
            scrollToFirstError
            autoComplete="off"
          >
            <FormEmailItem />
            <FormPasswordItem />
            <FormUserSubmitItem
              loading={logging}
              text={logging ? '登录中…' : '登录'}
            />
          </Form>
        </Card>
      </FormUserLayout>
    </>
  )
}

export default SignUp
