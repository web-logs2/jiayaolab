import { EyeOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Empty,
  List,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd'
import { FC } from 'react'
import avatar from '../../assets/avatar.png'
import { PostModelType } from '../../models/post'
import { formatDate } from '../../utils/format'
import FetchFailed from '../FetchFailed'
import IconText from '../IconText'
import classes from './index.module.less'

const { Text, Title, Paragraph, Link } = Typography
/**
 * 帖子卡片的列表
 * @param size 当前页面大小
 * @param loading 是否正在加载
 * @param loadMoreHandler 点击加载更多按钮的逻辑处理
 * @param posts 帖子
 * @param errorMsg 错误信息
 */
const PostList: FC<{
  size: number
  loading: boolean
  loadMoreHandler: () => void
  posts: PostModelType[] | null
  errorMsg: string | null
}> = ({ size, loading, loadMoreHandler, posts, errorMsg }) => {
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
    <FetchFailed errorMsg={errorMsg} />
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
              <div key="created-o">{formatDate(post.createdAt)}</div>,
              <IconText icon={<LikeOutlined />} text={0} key="like-o" />,
              <IconText icon={<StarOutlined />} text={0} key="star-o" />,
              <IconText icon={<EyeOutlined />} text={0} key="view-o" />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar size="large" src={avatar} className={classes.avatar} />
              }
              title={
                <Space size="large" align="center">
                  <Text className={classes.username}>千秋花hana</Text>
                  <div>
                    <Tag color="red">管理员</Tag>
                    <Tag color="orange">VIP</Tag>
                  </div>
                </Space>
              }
              description={
                <Text type="secondary">
                  用代码表达言语的魅力，用代码书写山河的壮丽
                </Text>
              }
            />
            <Link href={`/post/detail/${post.uuid}`} target="_blank">
              <Title level={4}>{post.title}</Title>
              <Paragraph ellipsis={{ rows: 4 }}>
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
              </Paragraph>
            </Link>
          </List.Item>
        </Card>
      )}
      loadMore={
        <div className={classes.loadMore} hidden={posts.length < size * 5}>
          <Button
            type="primary"
            disabled={loading || posts.length < size * 5}
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
