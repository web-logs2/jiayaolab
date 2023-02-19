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
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeadTitle from '../../components/HeadTitle'
import TextEditor from '../../components/TextEditor'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { pushPost } from '../../services/post'
import {
  addTitleDraft,
  removeDraft,
  setPush,
} from '../../store/features/articleSlice'

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
  const navigateHandler = () => {
    // 发布成功后如果还在发布帖子页面则返回主页
    // 这里需要用到window的location对象，使用useLocation的钩子会有问题
    if (window.location.pathname === '/post/new') {
      navigate('/posts')
    }
  }
  const setPushHandler = (value: boolean) => dispatch(setPush({ value }))
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
      .catch(reason => {
        message.open({
          key,
          type: 'error',
          content: `帖子发布失败，${reason}`,
        })
      })
      .finally(() => setPushHandler(false))
  }

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
          initialValues={{ title }}
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
            ]}
          >
            <Input
              autoFocus
              placeholder="标题（必填）"
              onPressEnter={e => e.preventDefault()}
              onChange={e => dispatch(addTitleDraft({ title: e.target.value }))}
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
            ]}
          >
            <TextEditor
              pushing={pushing}
              onValidateHandler={() => form.validateFields(['html'])}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Checkbox
                checked={publicly}
                onChange={e => setPublicly(e.target.checked)}
              />
              <Text>公开访问</Text>
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
                  navigate('/posts')
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
