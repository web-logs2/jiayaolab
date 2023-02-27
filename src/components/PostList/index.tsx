import {
  EyeOutlined,
  LikeOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Empty,
  List,
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
import IconText from '../IconText'
import classes from './index.module.less'

const { Text, Title, Paragraph, Link } = Typography
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
          <div className={classes.loadingItem} key={index}>
            <Card>
              <Skeleton avatar paragraph={{ rows: 3 }} active />
            </Card>
          </div>
        )
      )}
    </>
  ) : errorMsg || !posts ? (
    <ErrorBoundaryOnFetch errorMsg={errorMsg} />
  ) : posts.length ? (
    <List
      itemLayout="vertical"
      dataSource={posts}
      split={false}
      renderItem={post => (
        <Card className={classes.listCard}>
          <List.Item
            className={classes.listItem}
            actions={[
              <Tooltip
                key="date"
                placement="bottom"
                title={`最后一次更新在 ${fromNowDate(post.updatedAt)}`}
              >
                <div>{formatDate(post.createdAt)}</div>
              </Tooltip>,
              <IconText icon={<LikeOutlined />} text={0} key="like" />,
              <IconText icon={<StarOutlined />} text={0} key="star" />,
              <IconText icon={<EyeOutlined />} text={0} key="view" />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size="large"
                  draggable={false}
                  icon={<UserOutlined />}
                />
              }
              title={
                <Space size="large" align="center">
                  <Title level={5}>{post.user.username}</Title>
                  <div hidden>
                    <Tag color="red">管理员</Tag>
                    <Tag color="orange">VIP</Tag>
                  </div>
                </Space>
              }
              description={<Text type="secondary">{post.user.bio}</Text>}
            />
            <Link href={`${POST_DETAIL}/${post.uuid}`} target="_blank">
              <Title level={3} ellipsis>
                {post.title}
              </Title>
              <Paragraph ellipsis={{ rows: 2 }} type="secondary">
                {post.text}
              </Paragraph>
            </Link>
          </List.Item>
        </Card>
      )}
      loadMore={
        <div className={classes.loadMore} hidden={posts.length < size * 5}>
          <Button
            type="primary"
            disabled={posts.length < size * 5}
            onClick={loadMoreHandler}
          >
            点击查看更多
          </Button>
        </div>
      }
    />
  ) : (
    <Empty description={false} className={classes.emptyPostList} />
  )
}

export default PostList
