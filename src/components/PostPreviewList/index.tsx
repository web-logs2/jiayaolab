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
  Tag,
  Typography,
} from 'antd'
import { FC } from 'react'
import { POST } from '../../constant/paths'
import { useTypedSelector } from '../../hook'
import ErrorBoundaryOnFetch from '../ErrorBoundaryOnFetch'
import IconText from '../IconText'
import TimelineDetail from '../TimelineDetail'
import UserPreviewCard from '../UserPreviewCard'
import classes from './index.module.less'

const { Text, Paragraph, Link, Title } = Typography
/**
 * 帖子预览卡片的列表
 * @param size 当前页面大小
 * @param loadMoreHandler 点击加载更多按钮的逻辑处理
 */
const PostPreviewList: FC<{
  size: number
  loadMoreHandler: () => void
}> = ({ size, loadMoreHandler }) => {
  const { loading, posts, errorMsg } = useTypedSelector(s => s.postSlice)

  return loading ? (
    <>
      {Array.from({ length: posts?.length || 5 }).map((_, index) => (
        <Card className={classes.cardItem} key={index}>
          <Skeleton active paragraph={{ style: { marginBlockEnd: 0 } }} />
        </Card>
      ))}
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
            <Col span={24}>
              <div className={classes.cardHeader}>
                <UserPreviewCard
                  size="default"
                  loading={loading}
                  userId={post.user.uuid}
                  name={post.user.username}
                  paragraph={{ maxWidth: 230 }}
                />
                <Divider type="vertical" />
                <TimelineDetail date={post.createdAt} placement="right" />
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
              <div className={classes.cardFooter}>
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
        <div
          className={classes.loadMoreButton}
          hidden={posts.length < size * 5}
        >
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

export default PostPreviewList
