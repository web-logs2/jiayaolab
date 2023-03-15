import { EditOutlined, FileSearchOutlined } from '@ant-design/icons'
import {
  App as AntdApp,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
  Switch,
  Tag,
  Typography,
} from 'antd'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeadTitle from '../../components/HeadTitle'
import PopConfirmOnDelete from '../../components/PopConfirmOnDelete'
import TagList from '../../components/TagList'
import TextEditor from '../../components/TextEditor'
import TimelineDetail from '../../components/TimelineDetail'
import { POST_NEW, USER_LOGIN } from '../../constant/paths'
import { useDebouncedEffect, useTypedSelector } from '../../hook'
import { DraftModuleType } from '../../models/draft'
import {
  listAllByDraft,
  removeDraftById,
  saveDraft,
} from '../../services/draft'
import { savePost } from '../../services/post'
import { urlRedirect } from '../../utils/redirect'
import classes from './index.module.less'

const postNewKey = 'PostNew'
const removeDraftKey = 'RemoveDraft'
const { Title, Text, Paragraph } = Typography
const PostNew: FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { message } = AntdApp.useApp()
  const { token } = useTypedSelector(s => s.userSlice)
  // 帖子标题
  const [title, setTitle] = useState<string>('')
  // 帖子标签
  const [tags, setTags] = useState<string[]>([])
  // 帖子内容
  const [textContent, setTextContent] = useState<string>('')
  const [htmlContent, setHtmlContent] = useState<string>('')
  // 帖子的全部内容（标题、标签、内容、仅自己可见）
  const [formValues, setFormValues] = useState<{
    title: string
    tags: string[]
    textContent: string
    _private: boolean
  } | null>(null)
  // 帖子仅自己可见
  const [_private, setPrivate] = useState<boolean>(false)
  // 帖子发布的状态
  const [pushing, setPushing] = useState<boolean>(false)

  // 草稿id获取状态
  const [draftIdFetching, setDraftIdFetching] = useState<boolean>(false)
  // 草稿id
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  // 草稿箱打开状态
  const [draftOpening, setDraftOpening] = useState<boolean>(false)
  // 草稿列表获取状态
  const [draftListFetching, setDraftListFetching] = useState<boolean>(false)
  // 草稿列表
  const [draftList, setDraftList] = useState<DraftModuleType[] | null>(null)
  // 草稿保存状态
  const [saveMessage, setSaveMessage] = useState<string>('')
  const [removing, setRemoving] = useState<boolean>(false)
  const formUpdateHandler = (draft: DraftModuleType) => {
    setTitle(draft.title)
    form.setFieldValue('title', draft.title)
    setTags(draft.tags)
    form.setFieldValue('tags', draft.tags)
    setTextContent(draft.text)
    form.setFieldValue('textContent', draft.text)
    setHtmlContent(draft.html)
    setPrivate(draft._private)
    form.setFieldValue('_private', draft._private)
  }

  // 点击发布按钮的处理
  const savePostHandler = () => {
    // 开始发布
    setPushing(true)
    message.open({
      key: postNewKey,
      type: 'loading',
      content: '帖子发布中…',
      duration: 0,
    })
    // 发布帖子
    savePost({
      title,
      tags,
      text: textContent,
      html: htmlContent,
      _private,
      draftId: currentDraftId,
    })
      .then(res => {
        message.open({
          key: postNewKey,
          type: 'success',
          content: res.message,
        })
        // 发布成功后如果还在发布帖子页面则返回主页
        // 这里需要用到window的location对象，使用useLocation的钩子会有问题
        if (window.location.pathname === POST_NEW) {
          navigate('/')
        }
      })
      .catch(err =>
        message.open({
          key: postNewKey,
          type: 'error',
          content: `帖子发布失败，${err.message}`,
        })
      )
      .finally(() => setPushing(false))
  }
  // 获取草稿列表处理程序
  const listAllByDraftHandler = () => {
    // 显示草稿箱的加载中组件
    setDraftListFetching(true)
    // 获取草稿列表
    listAllByDraft()
      .then(({ data }) => setDraftList(data))
      .catch(err => message.error(err.message))
      .finally(() => setDraftListFetching(false))
  }
  // 删除草稿处理函数
  const removeDraftByIdHandler = (draftId: string) => {
    message.open({
      key: removeDraftKey,
      type: 'loading',
      content: '草稿删除中…',
      duration: 0,
    })
    setRemoving(true)
    removeDraftById(draftId)
      .then(res => {
        message.open({
          key: removeDraftKey,
          type: 'success',
          content: res.message,
        })
        // 重新获取草稿列表
        listAllByDraftHandler()
        // 重置当前编辑器草稿id
        setCurrentDraftId(null)
      })
      .catch(err => {
        message.open({
          key: removeDraftKey,
          type: 'error',
          content: `草稿删除失败，${err.message}`,
        })
      })
      .finally(() => setRemoving(false))
  }

  // 判断用户是否已登录
  useEffect(() => {
    if (!token) {
      navigate(urlRedirect(USER_LOGIN, POST_NEW), { replace: true })
    }
  }, [token])
  // 防抖钩子，实现自动保存草稿
  useDebouncedEffect(
    () => {
      // 如果表单内容发生改变，并且此时草稿id的获取状态还未开始
      if (formValues && !draftIdFetching) {
        setSaveMessage('保存中…')
        // 还未开始获取草稿id，并且当前还没有草稿id，开始获取草稿id
        !draftIdFetching && !currentDraftId && setDraftIdFetching(true)
        saveDraft({
          uuid: currentDraftId,
          title: formValues.title,
          tags: formValues.tags,
          text: formValues.textContent,
          html: htmlContent,
          _private: formValues._private,
        })
          .then(res => {
            setCurrentDraftId(res.data.draftId)
            setSaveMessage(res.message)
          })
          .catch(err => {
            message.error(`保存失败，${err.message}`)
            setSaveMessage(`保存失败，${err.message}`)
          })
      }
    },
    1000,
    [formValues, draftIdFetching]
  )
  // 当草稿id获取到时，设置草稿id的获取状态
  useEffect(() => {
    if (currentDraftId) {
      setDraftIdFetching(false)
    }
  }, [currentDraftId])
  useEffect(() => {
    // 打开草稿箱时开始获取草稿列表
    if (draftOpening) {
      listAllByDraftHandler()
    }
  }, [draftOpening])
  return (
    <>
      <HeadTitle layers={['发布帖子']} />
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Card>
            <div className={classes.draftBox}>
              <Text type="secondary">{saveMessage}</Text>
              <Button
                icon={<FileSearchOutlined />}
                disabled={pushing}
                onClick={() => setDraftOpening(true)}
                style={{ marginInlineStart: 50 }}
              >
                草稿箱
              </Button>
              <Modal
                destroyOnClose
                open={draftOpening}
                onCancel={() => {
                  if (removing) return
                  setDraftOpening(false)
                }}
                footer={null}
                closable={false}
                title="草稿箱"
              >
                {!draftListFetching && !!draftList?.length && (
                  <List>
                    {draftList.map(draft => (
                      <List.Item key={draft.uuid}>
                        <div className={classes.draftLayout}>
                          <div className={classes.draftHeader}>
                            {draft._private && (
                              <Tag color="warning">仅自己可见</Tag>
                            )}
                            <Text type="secondary">
                              最后编辑：
                              <TimelineDetail
                                date={draft.updatedAt}
                                placement="bottom"
                              />
                            </Text>
                          </div>
                          <div>
                            <Title level={5}>{draft.title || '无标题'}</Title>
                            <Paragraph
                              type="secondary"
                              ellipsis={{ rows: 2 }}
                              style={{ marginBlockEnd: 0 }}
                            >
                              {draft.text
                                .replace(/\s+/g, ' ')
                                .trim()
                                .slice(0, 200) || '无内容'}
                            </Paragraph>
                          </div>
                          {!!draft.tags.length && <TagList tags={draft.tags} />}
                          <div className={classes.draftFooter}>
                            <Space>
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                disabled={removing}
                                onClick={() => {
                                  setDraftOpening(false)
                                  setCurrentDraftId(draft.uuid)
                                  formUpdateHandler(draft)
                                }}
                              >
                                编辑
                              </Button>
                              <Divider type="vertical" />
                              <PopConfirmOnDelete
                                description="确定要删除这个草稿吗？"
                                onConfirm={() =>
                                  removeDraftByIdHandler(draft.uuid)
                                }
                              />
                            </Space>
                          </div>
                        </div>
                      </List.Item>
                    ))}
                  </List>
                )}
                {draftListFetching && (
                  <List>
                    {draftList?.length ? (
                      draftList.map((_, index) => {
                        return (
                          <List.Item key={index}>
                            <Skeleton active />
                          </List.Item>
                        )
                      })
                    ) : (
                      <List.Item>
                        <Skeleton active />
                      </List.Item>
                    )}
                  </List>
                )}
                {!draftListFetching && !draftList?.length && (
                  <Empty description={false} />
                )}
              </Modal>
            </div>
            <Form
              form={form}
              initialValues={{
                title,
                tags,
                textContent,
                _private,
              }}
              onValuesChange={(_changedValues, values) => {
                setSaveMessage('保存中…')
                setFormValues(values)
              }}
              onFinish={savePostHandler}
              disabled={pushing}
              scrollToFirstError
              autoComplete="off"
            >
              <Form.Item
                label="标题"
                colon={false}
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
                  onChange={e => setTitle(e.target.value)}
                  showCount
                  maxLength={30}
                />
              </Form.Item>
              <Form.Item
                label="标签"
                colon={false}
                name="tags"
                rules={[
                  { required: true, message: '请填写帖子标签' },
                  () => ({
                    validator(_ruleObject, values) {
                      if (values.length > 8) {
                        return Promise.reject('最多填写8个帖子标签')
                      }
                      return Promise.resolve()
                    },
                  }),
                  () => ({
                    validator(_ruleObject, values) {
                      if (values.filter((v: string) => v.length > 10).length) {
                        return Promise.reject('标签单个长度不能超过10个字符')
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <Select
                  placeholder="标签（必填）"
                  notFoundContent={<Empty description={false} />}
                  maxTagTextLength={10}
                  mode="tags"
                  onChange={value => setTags(value)}
                  tokenSeparators={[',', '|', ' ', '，']}
                />
              </Form.Item>
              <Form.Item
                label="内容"
                colon={false}
                name="textContent"
                required
                rules={[
                  { required: true, message: '请填写帖子内容' },
                  { whitespace: true, message: '请填写帖子内容' },
                  { max: 30000, message: '帖子内容不能大于30000个字符' },
                ]}
              >
                <TextEditor
                  disabled={pushing}
                  textState={[textContent, setTextContent]}
                  htmlState={[htmlContent, setHtmlContent]}
                  onChange={value => form.setFieldValue('textContent', value)}
                />
              </Form.Item>
              <Form.Item name="_private" label="仅自己可见" colon={false}>
                <Switch
                  checked={_private}
                  onChange={value => setPrivate(value)}
                />
              </Form.Item>
              <Form.Item style={{ textAlign: 'center' }}>
                <Button
                  style={{ paddingInline: 24 }}
                  size="large"
                  type="primary"
                  htmlType="submit"
                  loading={pushing}
                >
                  {pushing ? '发布中…' : '发布'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PostNew
