import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  App as AntdApp,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { publishPost } from '../../services/post'

const { Title, Text } = Typography
const { TextArea } = Input
const PublishPost: FC = () => {
  const navigate = useNavigate()
  const [publish, setPublish] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const key = 'publishing'
  const { message } = AntdApp.useApp()
  const onFinish = ({ title, content }: { title: string; content: string }) => {
    // 开始发布
    setUploading(true)
    // 提示信息
    message.open({
      key,
      type: 'loading',
      content: '帖子发布中…',
      duration: 0,
    })
    // 发布帖子
    publishPost(title, content, publish)
      .then(({ data }) => {
        message.open({ key, type: 'success', content: data })
        // 发布成功后返回主页
        navigate('/')
      })
      .catch(reason => {
        message.open({ key, type: 'error', content: `帖子发布失败，${reason}` })
      })
      .finally(() => setUploading(false))
  }

  return (
    <Card>
      <Title level={3}>发布帖子</Title>
      <Form
        autoComplete="off"
        scrollToFirstError
        onFinish={onFinish}
        disabled={uploading}
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: '* 标题不能为空' }]}
        >
          <Input placeholder="标题" showCount maxLength={32} />
        </Form.Item>
        <Form.Item
          name="content"
          rules={[{ required: true, message: '* 内容详情不能为空' }]}
        >
          <TextArea
            placeholder="内容详情"
            autoSize={{ minRows: 8 }}
            showCount
            maxLength={256}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Checkbox
              checked={publish}
              onChange={e => setPublish(e.target.checked)}
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
            <Button type="primary" htmlType="submit" loading={uploading}>
              {uploading ? '发布中…' : '发布'}
            </Button>
            <Button onClick={() => navigate('/posts')}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default PublishPost
