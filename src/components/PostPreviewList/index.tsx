import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import {
  App as AntdApp,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  List,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { FC, useEffect } from 'react'
import { POST, USER_POST_LIST_ONLY } from '../../constant/paths'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { removePost } from '../../services/user'
import { clearPostList, setFetchSize } from '../../store/features/postSlice'
import ErrorBoundaryOnFetch from '../ErrorBoundaryOnFetch'
import IconText from '../IconText'
import TimelineDetail from '../TimelineDetail'
import UserPreviewCard from '../UserPreviewCard'
import classes from './index.module.less'

const key = 'RemovePost'
const { Text, Paragraph, Link, Title } = Typography
const PostPreviewList: FC<{
  fetchPostHandler: () => void
}> = ({ fetchPostHandler }) => {
  const { loading, posts, errorMsg, size } = useTypedSelector(s => s.postSlice)
  const { loginUserId } = useTypedSelector(s => s.userSlice)
  const { message } = AntdApp.useApp()
  const dispatch = useAppDispatch()
  const removePostHandler = (postId: string) => {
    message.open({
      key,
      type: 'loading',
      content: '帖子删除中…',
      duration: 0,
    })
    removePost(postId)
      .then(res => {
        message.open({
          key,
          type: 'success',
          content: res.message,
        })
        // 删除一篇帖子后清空列表，若用户删除的是最后一篇帖子
        // 则会出现删除后依然存在的情况，即使数据库中已经删除和后端返回是空数组的情况
        // 在异步thunk中fulfilled类型不会把空数组替换，而是叠加（后续看情况修复）
        dispatch(clearPostList())
        // 可能删除后帖子数量不够第二页，所以要重置页面大小
        dispatch(setFetchSize(1))
        // 重新获取用户帖子处理函数
        fetchPostHandler()
      })
      .catch(err => {
        message.open({
          key,
          type: 'success',
          content: `帖子删除失败，${err.message}`,
        })
      })
  }

  // 组件加载完成开始获取帖子处理函数
  useEffect(() => {
    fetchPostHandler()
  }, [])
  useEffect(() => {
    // 搜索页面的处理
    if (size > 1) {
      fetchPostHandler()
    }
  }, [size])
  // 组件销毁时清除帖子，重置页面大小
  useEffect(
    () => () => {
      dispatch(setFetchSize(1))
      dispatch(clearPostList())
    },
    []
  )
  if (errorMsg) {
    return <ErrorBoundaryOnFetch errorMsg={errorMsg} />
  }
  return (
    <Card className={classes.card}>
      <List>
        {!!posts?.length &&
          posts.map(post => {
            return (
              <List.Item key={post.uuid}>
                <Row gutter={[0, 12]}>
                  <Col span={24}>
                    <div className={classes.cardHeader}>
                      <UserPreviewCard
                        size="default"
                        loading={false}
                        userId={post.user.uuid}
                        name={post.user.username}
                        paragraph={{ maxWidth: 230 }}
                      />
                      <Divider type="vertical" />
                      <TimelineDetail
                        date={post.createdAt}
                        placement="bottom"
                      />
                    </div>
                  </Col>
                  <Col span={24}>
                    <Link
                      href={`${POST}/${post.uuid}`}
                      target="_blank"
                      className={classes.cardLink}
                    >
                      <Title level={5}>{post.title}</Title>
                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 2 }}
                        style={{ marginBlockEnd: 0 }}
                      >
                        {post.text}
                      </Paragraph>
                    </Link>
                  </Col>
                  <Col span={24}>
                    <Text type="secondary">
                      <Space wrap style={{ justifyContent: 'center' }}>
                        <IconText icon={<EyeOutlined />} text={3487} />
                        <Divider type="vertical" />
                        <IconText icon={<MessageOutlined />} text={1598} />
                        <Divider type="vertical" />
                        <IconText icon={<LikeOutlined />} text={12417} />
                        {location.pathname.includes(USER_POST_LIST_ONLY) &&
                          post.user.uuid === loginUserId && (
                            <div style={{ marginInlineStart: 32 }}>
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                disabled
                              >
                                编辑
                              </Button>
                              <Divider type="vertical" />
                              <Popconfirm
                                title="删除帖子"
                                description={
                                  <>
                                    <Text>确定要删除帖子吗？</Text>
                                    <br />
                                    <Text type="danger">
                                      （帖子删除后无法还原）
                                    </Text>
                                  </>
                                }
                                onConfirm={() => removePostHandler(post.uuid)}
                                okText="是"
                                cancelText="否"
                              >
                                <Button
                                  danger
                                  type="text"
                                  size="small"
                                  icon={<DeleteOutlined />}
                                >
                                  删除
                                </Button>
                              </Popconfirm>
                            </div>
                          )}
                      </Space>
                    </Text>
                  </Col>
                </Row>
              </List.Item>
            )
          })}
        {!loading && !posts?.length && (
          <Empty description={false} className={classes.empty} />
        )}
        {loading &&
          Array.from({ length: 5 }).map((_, index) => {
            return (
              <List.Item key={index}>
                <Skeleton active paragraph={{ style: { marginBlockEnd: 0 } }} />
              </List.Item>
            )
          })}
        {!!posts?.length && posts.length >= size * 5 && (
          <List.Item className={classes.loadMore}>
            <Button
              disabled={posts.length < size * 5}
              onClick={() => dispatch(setFetchSize(size + 1))}
              type="link"
            >
              点击加载更多
            </Button>
          </List.Item>
        )}
      </List>
    </Card>
  )
}

export default PostPreviewList
