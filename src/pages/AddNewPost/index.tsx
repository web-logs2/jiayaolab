import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  App as AntdApp,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Popconfirm,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeadTitle from '../../components/HeadTitle'
import TextEditor from '../../components/TextEditor'
import { POSTS, POST_NEW, USER_LOGIN } from '../../constant/paths'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { pushPost } from '../../services/post'
import {
  removeDraft,
  setPushing,
  setTitleDraft,
} from '../../store/features/articleSlice'
import { removeToken } from '../../store/features/tokenOnlySlice'

const key = 'AddNewPost'
const { Title, Text, Paragraph } = Typography
const AddNewPost: FC = () => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  // 公开访问选项，默认开启
  const [publicly, setPublicly] = useState<boolean>(true)
  // 撰写的内容（也可以称为草稿箱，在页面不刷新的前提下，切换页面不会导致撰写的内容消失）
  const { title, text, html, pushing } = useTypedSelector(s => s.articleSlice)
  const { token } = useTypedSelector(s => s.tokenOnlySlice)
  const navigateHandler = () => {
    // 发布成功后如果还在发布帖子页面则返回主页
    // 这里需要用到window的location对象，使用useLocation的钩子会有问题
    if (window.location.pathname === POST_NEW) {
      navigate(POSTS)
    }
  }
  const setPushHandler = (value: boolean) => dispatch(setPushing(value))
  const removeDraftHandler = () => dispatch(removeDraft())
  // 发布按钮的逻辑处理
  const onFinish = () => {
    // 开始发布
    setPushHandler(true)
    message.open({
      key,
      type: 'loading',
      content: '帖子发布中…',
      duration: 0,
    })
    // 发布帖子
    pushPost(title, text, html, publicly)
      .then(({ data }) => {
        removeDraftHandler()
        navigateHandler()
        message.open({
          key,
          type: 'success',
          content: data,
        })
      })
      .catch(err => {
        message.open({
          key,
          type: 'error',
          content: `帖子发布失败，${err.message}`,
        })
        // 用户失效后重定向到登录页面
        if (err.code === 401) {
          dispatch(removeToken())
          navigate(USER_LOGIN, { replace: true })
        }
      })
      .finally(() => setPushHandler(false))
  }

  useEffect(() => {
    if (!token) {
      message.error('登录后才能发布帖子！')
      navigate('/', { replace: true })
    }
  }, [token])
  return (
    <>
      <HeadTitle prefix="发布帖子" />
      <Card>
        <Title level={3}>发布帖子</Title>
        <Paragraph type="warning">
          注：切换页面后当前撰写的内容将会保存在草稿箱，帖子发布成功或点击取消发布帖子后将清空草稿箱。
        </Paragraph>
        <Form
          form={form}
          initialValues={{ title, publicly }}
          onFinish={onFinish}
          disabled={pushing}
          scrollToFirstError
          autoComplete="off"
        >
          <Form.Item
            name="title"
            rules={[
              { required: true, message: '请填写帖子标题' },
              { whitespace: true, message: '请填写帖子标题' },
              { max: 30, message: '帖子标题不能大于30个字符' },
            ]}
          >
            <Input
              autoFocus
              placeholder="标题（必填）"
              onPressEnter={e => e.preventDefault()}
              onChange={({ target: { value } }) =>
                dispatch(setTitleDraft(value))
              }
              showCount
              maxLength={30}
            />
          </Form.Item>
          <Form.Item
            name="html"
            rules={[
              () => ({
                validator() {
                  if (text.trim().length) {
                    return Promise.resolve()
                  }
                  return Promise.reject('请填写帖子内容')
                },
              }),
              () => ({
                validator() {
                  if (text.trim().length < 30000) {
                    return Promise.resolve()
                  }
                  return Promise.reject('帖子内容不能大于30000个字符')
                },
              }),
            ]}
          >
            <TextEditor
              pushing={pushing}
              onValidateHandler={() => form.validateFields(['html'])}
            />
          </Form.Item>
          <Form.Item name="publicly" label="公开访问">
            <Space>
              <Checkbox
                checked={publicly}
                onChange={e => setPublicly(e.target.checked)}
              />
              <Tooltip title="所有用户都能阅读这篇帖子">
                <Text type="secondary">
                  <QuestionCircleOutlined />
                </Text>
              </Tooltip>
            </Space>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={pushing}>
                {pushing ? '发布中…' : '发布'}
              </Button>
              <Popconfirm
                title="取消发布"
                description={
                  <>
                    <Text>确定要取消发布帖子吗？</Text>
                    <br />
                    <Text type="danger">（撰写的内容将会被清除）</Text>
                  </>
                }
                onConfirm={() => {
                  removeDraftHandler()
                  navigate(POSTS)
                  message.warning('已取消！')
                }}
                okText="是"
                cancelText="否"
              >
                <Button>取消</Button>
              </Popconfirm>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}

export default AddNewPost
