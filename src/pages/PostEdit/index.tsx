import { App as AntdApp, Card, Divider, Form, Skeleton, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ErrorBoundaryOnFetch from '../../components/ErrorBoundaryOnFetch'
import FormPrivateItem from '../../components/FormPrivateItem'
import FormSubmitItem from '../../components/FormSubmitItem'
import FormTagItem from '../../components/FormTagItem'
import FormTextContentItem from '../../components/FormTextContentItem'
import FormTitleItem from '../../components/FormTitleItem'
import HeadTitle from '../../components/HeadTitle'
import PageNotFound from '../../components/PageNotFound'
import TextEditor from '../../components/TextEditor'
import { POST, POST_EDIT_ONLY, USER_LOGIN } from '../../constant/paths'
import { useTypedSelector } from '../../hook'
import { PostModelType } from '../../models/post'
import { getEditPostById, savePostByEdit } from '../../services/post'
import { urlRedirect } from '../../utils/redirect'
import uuidTest from '../../utils/uuidTest'

const editPostKey = 'EditPostKey'
const { Title } = Typography
const PostEdit: FC = () => {
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  // 需要编辑的帖子id
  const { postId } = useParams<{ postId: string }>()
  const { loginUserId } = useTypedSelector(s => s.userSlice)
  // 需要编辑帖子的详情
  const [editPostDetail, setEditPostDetail] = useState<PostModelType | null>(
    null
  )
  // 获取帖子详情中
  const [loading, setLoading] = useState<boolean>(true)
  // 获取帖子详情时出现的错误
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  // 是否更新中
  const [updating, setUpdating] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [textContent, setTextContent] = useState<string>('')
  const [htmlContent, setHtmlContent] = useState<string>('')
  // 更新帖子
  const savePostByEditHandler = () => {
    if (editPostDetail?.uuid) {
      // 开始更新
      setUpdating(true)
      message.open({
        key: editPostKey,
        type: 'loading',
        content: '帖子更新中…',
        duration: 0,
      })
      // 保存编辑过的帖子
      savePostByEdit({
        postId: editPostDetail.uuid,
        title: form.getFieldValue('title'),
        tags: form.getFieldValue('tags'),
        text: form.getFieldValue('textContent'),
        html: htmlContent,
        _private: form.getFieldValue('_private'),
      })
        .then(res => {
          message.open({
            key: editPostKey,
            type: 'success',
            content: res.message,
          })
          if (window.location.pathname.endsWith(`/${POST_EDIT_ONLY}`)) {
            navigate(`${POST}/${postId}`)
          }
        })
        .catch(err => {
          message.open({
            key: editPostKey,
            type: 'error',
            content: `帖子更新失败，${err.message}`,
          })
        })
        .finally(() => setUpdating(false))
    }
  }

  // 判断用户是否登录
  useEffect(() => {
    if (!loginUserId) {
      // 用户没有登录则前往登录页面并添加重定向
      navigate(urlRedirect(USER_LOGIN, location.pathname), { replace: true })
    }
  }, [loginUserId])
  useEffect(() => {
    if (postId) {
      // 开始获取帖子详情
      setLoading(true)
      errorMsg && setErrorMsg(null)
      getEditPostById(postId)
        .then(({ data }) => {
          // 设置编辑帖子详情
          setEditPostDetail(data)
          // 设置富文本编辑器内容
          setTextContent(data.text)
          setHtmlContent(data.html)
        })
        .catch(err => setErrorMsg(err.message))
        .finally(() => setLoading(false))
    }
  }, [postId])
  if (errorMsg) {
    return <ErrorBoundaryOnFetch errorMsg={errorMsg} />
  }
  return (
    <Card>
      <HeadTitle layers={['编辑帖子']} />
      <Title level={3}>编辑帖子</Title>
      <Divider />
      {loading && <Skeleton active />}
      {!loading && editPostDetail && (
        <Form
          form={form}
          initialValues={{
            title: editPostDetail.title,
            tags: editPostDetail.tags,
            textContent: editPostDetail.text,
            _private: editPostDetail._private,
          }}
          onFinish={savePostByEditHandler}
          disabled={updating}
          autoComplete="off"
        >
          <FormTitleItem />
          <FormTagItem />
          <FormTextContentItem>
            <TextEditor
              disabled={updating}
              textState={[textContent, setTextContent]}
              htmlState={[htmlContent, setHtmlContent]}
              onChange={value => form.setFieldValue('textContent', value)}
            />
          </FormTextContentItem>
          <FormPrivateItem
            onChange={[
              editPostDetail._private,
              newValue => form.setFieldValue('_private', newValue),
            ]}
          />
          <FormSubmitItem
            loading={updating}
            text={updating ? '更新中…' : '更新'}
          />
        </Form>
      )}
    </Card>
  )
}

// 判断帖子id是否符合规则，减少服务器压力
const PostEditWrapper: FC = () => {
  // 帖子id
  const { postId } = useParams<{ postId: string }>()
  return uuidTest(postId) ? <PostEdit /> : <PageNotFound />
}

export default PostEditWrapper
