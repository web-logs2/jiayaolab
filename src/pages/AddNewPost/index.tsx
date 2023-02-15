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
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'
import HeadTitle from '../../components/HeadTitle'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { publishingPost } from '../../services/post'
import { addDraft, cleanDraft } from '../../store/features/draftSlice'
import './index.less'

const key = 'AddNewPost'
const { Title, Text, Paragraph } = Typography
const AddNewPost: FC = () => {
  const navigate = useNavigate()
  // 公开访问选项
  const [publicly, setPublicly] = useState<boolean>(true)
  // 是否正在发布中
  const [publishing, setPublishing] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  // 撰写的内容（也可以称为草稿箱，在页面不刷新的前提下，切换页面不会导致撰写的内容消失）
  // 成功发布&取消发布都会进行清空
  const { title, content, contentHtml } = useTypedSelector(s => s.draftSlice)
  const [form] = Form.useForm()
  const { message } = AntdApp.useApp()
  const addDraftHandler = (
    title: string,
    content: string,
    contentHtml: string
  ) => dispatch(addDraft({ title, content, contentHtml }))
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
    publishingPost(title, contentHtml, publicly)
      .then(({ data }) => {
        // 发布成功后返回主页
        navigate('/')
        dispatch(cleanDraft())
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

  useEffect(() => {
    form.setFieldsValue({ title, contentHtml })
  }, [title, contentHtml])
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
          initialValues={{ title, contentHtml }}
          onValuesChange={e => {
            addDraftHandler(
              e.title || title,
              content,
              e.contentHtml || contentHtml
            )
          }}
          onFinish={onFinish}
          disabled={publishing}
          scrollToFirstError
          autoComplete="off"
        >
          <Form.Item
            name="title"
            rules={[
              () => ({
                // 禁止提交纯空白字符
                validator(_, value) {
                  if (value.trim().length) {
                    return Promise.resolve()
                  }
                  return Promise.reject('请填写帖子标题')
                },
              }),
            ]}
          >
            <Input
              onPressEnter={e => e.preventDefault()}
              placeholder="标题（必填）"
              showCount
              maxLength={30}
            />
          </Form.Item>
          <Form.Item
            name="contentHtml"
            rules={[
              () => ({
                validator() {
                  if (content.trim().length) {
                    return Promise.resolve()
                  }
                  return Promise.reject('请填写内容')
                },
              }),
            ]}
          >
            <ReactQuill
              theme="snow"
              placeholder="内容（必填）"
              onChange={(value, _delta, _source, editor) =>
                addDraftHandler(title, editor.getText(), value)
              }
              modules={{
                toolbar: [
                  [{ header: 1 }, { header: 2 }, { header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ align: [] }],
                  ['link', 'blockquote', 'code-block'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ indent: '-1' }, { indent: '+1' }],
                  [{ script: 'sub' }, { script: 'super' }],
                  ['clean'],
                ],
              }}
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
                  dispatch(cleanDraft())
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
