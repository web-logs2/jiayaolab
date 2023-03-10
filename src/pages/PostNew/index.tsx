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
import { POST_NEW, USER_LOGIN } from '../../constant/paths'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { submitPost } from '../../services/post'
import {
  removeDraft,
  setPushing,
  setTitleDraft,
} from '../../store/features/articleSlice'
import { urlRedirect } from '../../utils/redirect'

const key = 'PostNew'
const { Text, Paragraph } = Typography
const PostNew: FC = () => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  // 公开访问选项，默认开启
  const [_public, setPublic] = useState<boolean>(true)
  // 撰写的内容（也可以称为草稿箱，在页面不刷新的前提下，切换页面不会导致撰写的内容消失）
  const { title, text, html, pushing } = useTypedSelector(s => s.articleSlice)
  const { token } = useTypedSelector(s => s.userSlice)
  const navigateHandler = () => {
    // 发布成功后如果还在发布帖子页面则返回主页
    // 这里需要用到window的location对象，使用useLocation的钩子会有问题
    if (window.location.pathname === POST_NEW) {
      navigate('/')
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
    submitPost(title, text, html, _public)
      .then(res => {
        removeDraftHandler()
        navigateHandler()
        message.open({
          key,
          type: 'success',
          content: res.message,
        })
      })
      .catch(err => {
        message.open({
          key,
          type: 'error',
          content: `帖子发布失败，${err.message}`,
        })
      })
      .finally(() => setPushHandler(false))
  }

  useEffect(() => {
    if (!token) {
      navigate(urlRedirect(USER_LOGIN, POST_NEW), { replace: true })
    }
  }, [token])
  return (
    <>
      <HeadTitle layers={['发布帖子']} />
      <Card>
        <Paragraph type="warning">
          未发布的帖子将会自动保存为草稿，帖子发布成功或取消发布帖子后清空草稿。
        </Paragraph>
        <Form
          form={form}
          initialValues={{ title, _public }}
          onFinish={onFinish}
          disabled={pushing}
          scrollToFirstError
          autoComplete="off"
        >
          <Form.Item
            label="标题"
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
              onChange={e => dispatch(setTitleDraft(e.target.value))}
              showCount
              maxLength={30}
            />
          </Form.Item>
          <Form.Item
            label="内容"
            name="html"
            required
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
          <Form.Item name="_public" label="公开访问">
            <Space>
              <Checkbox
                checked={_public}
                onChange={e => setPublic(e.target.checked)}
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
                  navigate('/')
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

export default PostNew
