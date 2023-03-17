import {
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
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd'
import { FC, useEffect, useState } from 'react'
import { POST, USER_POST_LIST_ONLY } from '../../constant/paths'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { removePostById } from '../../services/post'
import { clearPostList, setFetchSize } from '../../store/features/postSlice'
import ErrorBoundaryOnFetch from '../ErrorBoundaryOnFetch'
import IconText from '../IconText'
import PopConfirmOnDelete from '../PopConfirmOnDelete'
import PostEditInfo from '../PostEditInfo'
import TagList from '../TagList'
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
  // 帖子是否正在删除中
  const [removing, setRemoving] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const removePostByIdHandler = (postId: string) => {
    message.open({
      key,
      type: 'loading',
      content: '帖子删除中…',
      duration: 0,
    })
    setRemoving(true)
    removePostById(postId)
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
          type: 'error',
          content: `帖子删除失败，${err.message}`,
        })
      })
      .finally(() => setRemoving(false))
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
                      {location.pathname.includes(USER_POST_LIST_ONLY) ? (
                        <>
                          {post.user.uuid === loginUserId &&
                            (post._private ? (
                              <Tag color="warning">仅自己可见</Tag>
                            ) : (
                              <Tag color="success">所有人可见</Tag>
                            ))}
                          <PostEditInfo post={post} />
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
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
                    <TagList tags={post.tags} />
                  </Col>
                  <Col span={24}>
                    <Text type="secondary">
                      <Space wrap style={{ justifyContent: 'center' }}>
                        <IconText icon={<EyeOutlined />} text={0} />
                        <Divider type="vertical" />
                        <IconText icon={<MessageOutlined />} text={0} />
                        <Divider type="vertical" />
                        <IconText icon={<LikeOutlined />} text={0} />
                        {location.pathname.includes(USER_POST_LIST_ONLY) &&
                          post.user.uuid === loginUserId && (
                            <>
                              <Divider type="vertical" />
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                disabled
                              >
                                编辑
                              </Button>
                              <Divider type="vertical" />
                              <PopConfirmOnDelete
                                removing={removing}
                                description="确定要删除这个帖子吗？"
                                onConfirm={() =>
                                  removePostByIdHandler(post.uuid)
                                }
                              />
                            </>
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
