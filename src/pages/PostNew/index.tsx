import { EditOutlined, FileSearchOutlined } from '@ant-design/icons'
import {
  App as AntdApp,
  Button,
  Card,
  Divider,
  Empty,
  Form,
  List,
  Modal,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormPrivateItem from '../../components/FormPrivateItem'
import FormSubmitItem from '../../components/FormSubmitItem'
import FormTagItem from '../../components/FormTagItem'
import FormTextContentItem from '../../components/FormTextContentItem'
import FormTitleItem from '../../components/FormTitleItem'
import HeadTitle from '../../components/HeadTitle'
import PopConfirmOnDelete from '../../components/PopConfirmOnDelete'
import TagList from '../../components/TagList'
import TextEditor from '../../components/TextEditor'
import TimelineDetail from '../../components/TimelineDetail'
import {
  POST_NEW_KEY,
  REMOVE_DRAFT_KEY,
  SAVING_ERROR_KEY,
} from '../../constant/messageKeys'
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

const { Title, Text, Paragraph } = Typography
const PostNew: FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { message } = AntdApp.useApp()
  const { loginUserId } = useTypedSelector(s => s.userSlice)
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
  // 草稿是否删除中
  const [draftRemoving, setDraftRemoving] = useState<boolean>(false)
  // 是否在保存中发生错误
  const [savingError, setSavingError] = useState<boolean>(false)
  const formUpdateHandler = (draft: DraftModuleType) => {
    // 设置标题
    setTitle(draft.title)
    form.setFieldValue('title', draft.title)
    // 设置标签
    setTags(draft.tags)
    form.setFieldValue('tags', draft.tags)
    // 设置文本内容
    setTextContent(draft.text)
    form.setFieldValue('textContent', draft.text)
    // 设置HTML格式内容
    setHtmlContent(draft.html)
    // 设置仅自己可见
    setPrivate(draft._private)
    form.setFieldValue('_private', draft._private)
    // 手动验证表单内容
    form.validateFields(['title', 'tags', 'textContent', '_private'])
  }
  // 点击发布按钮的处理
  const savePostHandler = () => {
    // 开始发布
    setPushing(true)
    message.open({
      key: POST_NEW_KEY,
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
          key: POST_NEW_KEY,
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
          key: POST_NEW_KEY,
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
      key: REMOVE_DRAFT_KEY,
      type: 'loading',
      content: '草稿删除中…',
      duration: 0,
    })
    setDraftRemoving(true)
    removeDraftById(draftId)
      .then(res => {
        message.open({
          key: REMOVE_DRAFT_KEY,
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
          key: REMOVE_DRAFT_KEY,
          type: 'error',
          content: `草稿删除失败，${err.message}`,
        })
      })
      .finally(() => setDraftRemoving(false))
  }

  // 判断用户是否已登录
  useEffect(() => {
    if (!loginUserId) {
      navigate(urlRedirect(USER_LOGIN, POST_NEW), { replace: true })
    }
  }, [loginUserId])
  // 防抖钩子，实现自动保存草稿
  useDebouncedEffect(
    () => {
      // 表单内容未发生改变
      // 并且此时草稿id还是未获取到的状态，而且没有在保存中发生过错误
      if (!formValues || draftIdFetching || savingError || pushing) {
        return
      }

      setSaveMessage('保存中…')
      // 判断当前草稿id是否不存在，开始尝试获取草稿id
      !currentDraftId && setDraftIdFetching(true)
      saveDraft({
        draftId: currentDraftId,
        title: formValues.title,
        tags: formValues.tags,
        text: formValues.textContent,
        html: htmlContent,
        _private: formValues._private,
      })
        .then(res => {
          message.destroy(SAVING_ERROR_KEY)
          // 获取到草稿id，更新state，并且effect钩子内进行草稿id已获取的处理
          setCurrentDraftId(res.data.draftId)
          setSaveMessage(res.message)
        })
        .catch(err => {
          message.open({
            key: SAVING_ERROR_KEY,
            type: 'error',
            content: `草稿保存失败，${err.message}`,
          })
          // 保存失败，获取不到草稿id了，此时这里关闭草稿id获取状态
          setDraftIdFetching(false)
          // 设置错误状态，代表在保存中发生错误
          // 每次在表单内容发生改变后，会重置错误状态，作用是依然可以尝试更新草稿
          setSavingError(true)
          setSaveMessage(`草稿保存失败，${err.message}`)
        })
    },
    1000,
    [formValues, draftIdFetching]
  )
  // 当草稿id获取到时，设置草稿id的获取状态
  useEffect(() => {
    if (currentDraftId) {
      // 设置草稿id为未获取的状态，因为草稿id已经获取到了
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
      <Card>
        <div className={classes.draftBox}>
          <Title level={3}>发布帖子</Title>
          <Text type="secondary">{saveMessage}</Text>
          <Button
            icon={<FileSearchOutlined />}
            disabled={pushing}
            onClick={() => setDraftOpening(true)}
          >
            草稿箱
          </Button>
          <Modal
            title="草稿箱"
            destroyOnClose
            open={draftOpening}
            onCancel={() => {
              if (!draftRemoving) {
                setDraftOpening(false)
              }
            }}
            closable={false}
            footer={null}
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
                            .slice(0, 192) || '无内容'}
                        </Paragraph>
                      </div>
                      {!!draft.tags.length && <TagList tags={draft.tags} />}
                      <div className={classes.draftFooter}>
                        <Space>
                          <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            disabled={draftRemoving}
                            onClick={() => {
                              // 销毁之前还未消失的错误信息
                              message.destroy(SAVING_ERROR_KEY)
                              // 重置当前保存状态信息
                              setSaveMessage('')
                              // 关闭草稿箱Modal
                              setDraftOpening(false)
                              // 设置当前编辑的草稿id
                              setCurrentDraftId(draft.uuid)
                              // 更新表单内容
                              formUpdateHandler(draft)
                            }}
                          >
                            编辑
                          </Button>
                          <Divider type="vertical" />
                          <PopConfirmOnDelete
                            removing={draftRemoving}
                            description="确定要删除这个草稿吗？"
                            onConfirm={() => removeDraftByIdHandler(draft.uuid)}
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
                {Array.from({ length: draftList?.length || 1 }).map(
                  (_, index) => (
                    <List.Item key={index}>
                      <Skeleton
                        active
                        paragraph={{ style: { marginBlockEnd: 0 } }}
                      />
                    </List.Item>
                  )
                )}
              </List>
            )}
            {!draftListFetching && !draftList?.length && (
              <Empty description={false} />
            )}
          </Modal>
        </div>
        <Divider />
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
            // 每次表单内容更新后重置保存错误内容
            savingError && setSavingError(false)
            setFormValues(values)
          }}
          onFinish={savePostHandler}
          disabled={pushing}
          scrollToFirstError
          autoComplete="off"
        >
          <FormTitleItem onChange={e => setTitle(e.target.value)} />
          <FormTagItem onChange={value => setTags(value)} />
          <FormTextContentItem>
            <TextEditor
              disabled={pushing}
              textState={[textContent, setTextContent]}
              htmlState={[htmlContent, setHtmlContent]}
              onChange={value => form.setFieldValue('textContent', value)}
            />
          </FormTextContentItem>
          <FormPrivateItem
            onChange={[_private, newValue => setPrivate(newValue)]}
          />
          <FormSubmitItem
            loading={pushing}
            text={pushing ? '发布中…' : '发布'}
          />
        </Form>
      </Card>
    </>
  )
}

export default PostNew
