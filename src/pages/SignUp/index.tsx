import { App as AntdApp, Card, Divider, Form, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import FormEmailItem from '../../components/FormEmailItem'
import FormPasswordItem from '../../components/FormPasswordItem'
import FormUserLayout from '../../components/FormUserLayout'
import FormUserSubmitItem from '../../components/FormUserSubmitItem'
import HeadTitle from '../../components/HeadTitle'
import { SIGN_UP_KEY } from '../../constant/messageKeys'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { saveUserByRegister } from '../../services/user'
import { setLoginUserId, setToken } from '../../store/features/userSlice'

const { Title, Paragraph } = Typography
const SignUp: FC = () => {
  const dispatch = useAppDispatch()
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [registering, setRegistering] = useState<boolean>(false)
  const { loginUserId } = useTypedSelector(s => s.userSlice)

  const saveUserByRegisterHandler = () => {
    setRegistering(true)
    message.open({
      key: SIGN_UP_KEY,
      type: 'loading',
      content: '注册中…',
      duration: 0,
    })
    saveUserByRegister(email, password)
      .then(res => {
        message.open({
          key: SIGN_UP_KEY,
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
          key: SIGN_UP_KEY,
          type: 'error',
          content: `注册失败，${err.message}`,
        })
      })
      .finally(() => setRegistering(false))
  }

  useEffect(() => {
    if (loginUserId) {
      navigate('/')
      message.error('你已登录，请先退出登录！')
    }
  }, [loginUserId])
  return (
    <>
      <HeadTitle layers={['用户注册']} />
      <FormUserLayout>
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
            onFinish={saveUserByRegisterHandler}
            disabled={registering}
            onValuesChange={changedValues => {
              changedValues.email && setEmail(changedValues.email)
              changedValues.password && setPassword(changedValues.password)
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
              loading={registering}
              text={registering ? '注册中…' : '立即注册'}
            />
          </Form>
        </Card>
      </FormUserLayout>
    </>
  )
}

export default SignUp
