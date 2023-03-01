import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Avatar,
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
  Tooltip,
  Typography,
} from 'antd'
import { FC } from 'react'
import { POST_DETAIL } from '../../constant/paths'
import { useTypedSelector } from '../../hook'
import { formatDate, fromNowDate } from '../../utils/format'
import ErrorBoundaryOnFetch from '../ErrorBoundaryOnFetch'
import FlexGrow from '../FlexGrow'
import IconText from '../IconText'
import classes from './index.module.less'

const { Text, Paragraph, Link, Title } = Typography
/**
 * 帖子卡片的列表
 * @param size 当前页面大小
 * @param loadMoreHandler 点击加载更多按钮的逻辑处理
 */
const PostList: FC<{
  size: number
  loadMoreHandler: () => void
}> = ({ size, loadMoreHandler }) => {
  const { loading, posts, errorMsg } = useTypedSelector(s => s.postSlice)

  return loading ? (
    <>
      {Array.from({ length: posts?.length ? posts.length : 5 }).map(
        (_, index) => (
          <Card className={classes.cardItem} key={index}>
            <Skeleton active />
          </Card>
        )
      )}
    </>
  ) : errorMsg || !posts ? (
    <ErrorBoundaryOnFetch errorMsg={errorMsg} />
  ) : posts.length ? (
    <List
      itemLayout="vertical"
      dataSource={posts}
      renderItem={post => (
        <Card className={classes.cardItem}>
          <Row gutter={[0, 12]}>
            <Col span={24} className={classes.userinfo}>
              <Space>
                <Avatar icon={<UserOutlined />} />
                <Text>{post.user.username}</Text>
              </Space>
              <Divider type="vertical" />
              <Tooltip title={formatDate(post.createdAt)} placement="right">
                <Text type="secondary">{fromNowDate(post.createdAt)}</Text>
              </Tooltip>
            </Col>
            <Col span={24}>
              <Link
                href={`${POST_DETAIL}/${post.uuid}`}
                target="_blank"
                className={classes.detailLink}
              >
                <Title level={5} className={classes.postTitle}>
                  {post.title}
                </Title>
                <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                  {post.text}
                </Paragraph>
              </Link>
              <div style={{ display: 'flex' }}>
                <div>
                  <Tag>标签</Tag>
                  <Tag>标签</Tag>
                  <Tag>标签</Tag>
                  <Tag>标签</Tag>
                  <Tag>标签</Tag>
                  <Tag>标签</Tag>
                  <Tag>标签</Tag>
                  <Tag>标签</Tag>
                </div>
                <FlexGrow />
                <Text type="secondary">
                  <Space>
                    <IconText icon={<EyeOutlined />} text={3487} />
                    <Divider type="vertical" />
                    <IconText icon={<MessageOutlined />} text={1598} />
                    <Divider type="vertical" />
                    <IconText icon={<LikeOutlined />} text={12417} />
                  </Space>
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      )}
      loadMore={
        <div className={classes.loadMore} hidden={posts.length < size * 5}>
          <Button
            type="primary"
            disabled={posts.length < size * 5}
            onClick={loadMoreHandler}
          >
            点击加载更多
          </Button>
        </div>
      }
    />
  ) : (
    <Empty description={false} style={{ paddingBlockStart: 50 }} />
  )
}

export default PostList
