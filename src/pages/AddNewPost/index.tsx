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
import { publishingPost } from '../../services/post'
import { addTitleDraft, removeDraft } from '../../store/features/draftSlice'

const key = 'AddNewPost'
const { Title, Text, Paragraph } = Typography
const AddNewPost: FC = () => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  // 是否正在发布中
  const [publishing, setPublishing] = useState<boolean>(false)
  // 公开访问选项，默认开启
  const [publicly, setPublicly] = useState<boolean>(true)
  // 撰写的内容（也可以称为草稿箱，在页面不刷新的前提下，切换页面不会导致撰写的内容消失）
  const { title, text, html } = useTypedSelector(s => s.draftSlice)
  // 发布按钮的逻辑处理
  const onFinish = () => {
    // 开始发布
    setPublishing(true)
    message.open({
      key,
      type: 'loading',
      content: '帖子发布中…',
      duration: 0,
    })
    // 发布帖子
    publishingPost(title, text, html, publicly)
      .then(({ data }) => {
        dispatch(removeDraft())
        // 发布成功后返回主页
        navigate('/')
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
      .finally(() => setPublishing(false))
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
          disabled={publishing}
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
              publishing={publishing}
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
              <Button type="primary" htmlType="submit" loading={publishing}>
                {publishing ? '发布中…' : '发布'}
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
                  dispatch(removeDraft())
                  navigate('/posts')
                  message.warning('帖子已取消发布！')
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
