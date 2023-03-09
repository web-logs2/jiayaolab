import { EyeOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  List,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { FC, useEffect } from 'react'
import { POST } from '../../constant/paths'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { clearPostList, setFetchSize } from '../../store/features/postSlice'
import ErrorBoundaryOnFetch from '../ErrorBoundaryOnFetch'
import IconText from '../IconText'
import TimelineDetail from '../TimelineDetail'
import UserPreviewCard from '../UserPreviewCard'
import classes from './index.module.less'

const { Text, Paragraph, Link, Title } = Typography
const PostPreviewList: FC<{
  fetchPostHandler: () => void
}> = ({ fetchPostHandler }) => {
  const { loading, posts, errorMsg, size } = useTypedSelector(s => s.postSlice)
  const dispatch = useAppDispatch()

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
                      <Space>
                        <IconText icon={<EyeOutlined />} text={3487} />
                        <Divider type="vertical" />
                        <IconText icon={<MessageOutlined />} text={1598} />
                        <Divider type="vertical" />
                        <IconText icon={<LikeOutlined />} text={12417} />
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
