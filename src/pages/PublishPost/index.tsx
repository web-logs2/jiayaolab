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
import { useAppDispatch, useTypedSelector } from '../../hook'
import { publishingPost } from '../../services/post'
import { addDraft } from '../../store/features/draftSlice'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const PublishPost: FC = () => {
  const navigate = useNavigate()
  // 公开访问选项
  const [publicly, setPublicly] = useState<boolean>(true)
  // 是否正在发布中
  const [publishing, setPublishing] = useState<boolean>(false)
  // 撰写的内容（也可以称为草稿箱，在页面不刷新的前提下，切换页面不会导致撰写的内容消失）
  // 成功发布&取消发布都会进行清空
  const { title, content } = useTypedSelector(s => s.draftSlice)
  const dispatch = useAppDispatch()
  const addDraftHandler = (title: string, content: string) =>
    dispatch(addDraft({ title, content }))
  const { message } = AntdApp.useApp()
  const key = 'PublishPost'
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
    publishingPost(title, content, publicly)
      .then(({ data }) => {
        // 发布成功后返回主页
        navigate('/')
        // 清空草稿
        addDraftHandler('', '')
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
    <Card>
      <Title level={3}>发布帖子</Title>
      <Paragraph type="warning">
        注：切换页面后当前撰写的内容将会保存在草稿箱，帖子发布成功或点击取消发布帖子后将清空草稿箱。
      </Paragraph>
      <Form
        scrollToFirstError
        onFinish={onFinish}
        disabled={publishing}
        autoComplete="off"
        initialValues={{ title, content }}
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: '* 标题不能为空！' }]}
        >
          <Input
            value={title}
            onChange={e => addDraftHandler(e.target.value, content)}
            placeholder="标题"
            showCount
            maxLength={32}
          />
        </Form.Item>
        <Form.Item
          name="content"
          rules={[{ required: true, message: '* 内容详情不能为空！' }]}
        >
          <TextArea
            value={content}
            onChange={e => addDraftHandler(title, e.target.value)}
            placeholder="内容详情"
            autoSize={{ minRows: 8 }}
            showCount
            maxLength={256}
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
                // 清空草稿
                addDraftHandler('', '')
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
  )
}

export default PublishPost
