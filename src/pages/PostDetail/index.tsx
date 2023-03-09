import { LikeFilled, StarOutlined } from '@ant-design/icons'
import {
  Affix,
  Button,
  Card,
  Col,
  Divider,
  Grid,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorBoundaryOnFetch from '../../components/ErrorBoundaryOnFetch'
import FlexGrow from '../../components/FlexGrow'
import GlobalAnnouncement from '../../components/GlobalAnnouncement'
import HeadTitle from '../../components/HeadTitle'
import IconText from '../../components/IconText'
import TimelineDetail from '../../components/TimelineDetail'
import UserPreviewCard from '../../components/UserPreviewCard'
import { PostModelType } from '../../models/post'
import { fetchPostDetail } from '../../services/post'
import classes from './index.module.less'

const { useBreakpoint } = Grid
const { Title, Text, Paragraph } = Typography
const PostDetail: FC = () => {
  // 帖子id
  const { postId } = useParams<{ postId: string }>()
  const { xs, lg } = useBreakpoint()
  const isMobile = xs || !lg
  // 帖子详情
  const [postDetail, setPostDetail] = useState<PostModelType | null>(null)
  // 获取帖子详情中
  const [loading, setLoading] = useState<boolean>(true)
  // 获取帖子详情时出现的错误
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  // 按钮加载中
  const LoadingButton: FC<PropsWithChildren> = ({ children }) => {
    return (
      <Skeleton
        active
        loading={loading}
        avatar={{ size: 'large', style: { marginInlineEnd: -16 } }}
        title={false}
        paragraph={false}
      >
        {children}
      </Skeleton>
    )
  }
  const UserPrevCard: FC = () => {
    return (
      <Card>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <UserPreviewCard
              size="large"
              loading={loading}
              userId={postDetail?.user.uuid}
              name={postDetail?.user.username}
            />
          </Col>
          <Col span={24} hidden={!loading && !postDetail?.user.bio}>
            <Skeleton
              active
              loading={loading}
              title={false}
              paragraph={{ rows: 3, style: { marginBlockEnd: 0 } }}
            >
              <Paragraph
                type="secondary"
                title={postDetail?.user.bio || ''}
                style={{ marginBlockEnd: 0 }}
                ellipsis={{ rows: 3 }}
              >
                {postDetail?.user.bio}
              </Paragraph>
            </Skeleton>
          </Col>
        </Row>
      </Card>
    )
  }

  // 匹配到路由，当有id参数时执行钩子
  useEffect(() => {
    if (postId) {
      fetchPostDetail(postId)
        .then(({ data }) => setPostDetail(data))
        .catch(err => setErrorMsg(err.message))
        .finally(() => setLoading(false))
    }
  }, [postId])
  return (
    <>
      <HeadTitle layers={[postDetail?.title, '帖子详情']} />
      {loading || postDetail ? (
        <Row gutter={[16, 16]}>
          <Col span={isMobile ? 24 : 17}>
            <Card className={classes.card}>
              <div>
                <Skeleton
                  active
                  loading={loading}
                  title={{ className: classes.titleLoading }}
                  paragraph={{ rows: 1, className: classes.timelineLoading }}
                >
                  <Title level={3} className={classes.title}>
                    {postDetail?.title}
                  </Title>
                  <Paragraph className={classes.timeline}>
                    <Text type="secondary">
                      帖子发表：
                      <TimelineDetail
                        date={postDetail?.createdAt}
                        placement="bottom"
                      />
                    </Text>
                    {postDetail?.createdAt !== postDetail?.updatedAt && (
                      <>
                        <Divider type="vertical" />
                        <Text type="secondary">
                          最后编辑：
                          <TimelineDetail
                            date={postDetail?.updatedAt}
                            placement="bottom"
                          />
                        </Text>
                      </>
                    )}
                  </Paragraph>
                </Skeleton>
                <Skeleton
                  active
                  loading={loading}
                  paragraph={{ rows: 8, style: { marginBlockEnd: 48 } }}
                >
                  <Paragraph style={{ marginBlockEnd: 48 }}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: postDetail?.html || '',
                      }}
                    />
                  </Paragraph>
                </Skeleton>
              </div>
              <FlexGrow />
              <div>
                <Divider style={{ marginBlockStart: 0 }} />
                <div className={classes.actions}>
                  <Space size="large">
                    <LoadingButton>
                      <IconText
                        icon={
                          <Button
                            shape="circle"
                            size="large"
                            type="primary"
                            icon={<LikeFilled />}
                          />
                        }
                        text={<Text type="secondary">25368</Text>}
                      />
                    </LoadingButton>
                    <LoadingButton>
                      <IconText
                        icon={
                          <Button
                            shape="circle"
                            size="large"
                            icon={<StarOutlined />}
                          />
                        }
                        text={<Text type="secondary">441</Text>}
                      />
                    </LoadingButton>
                  </Space>
                  {loading ? (
                    <Skeleton.Button />
                  ) : (
                    <Button type="link" danger>
                      举报
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </Col>
          <Col span={isMobile ? 24 : 7}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <GlobalAnnouncement />
              </Col>
              <Col span={24}>
                {isMobile ? (
                  <UserPrevCard />
                ) : (
                  <Affix offsetTop={16}>
                    <UserPrevCard />
                  </Affix>
                )}
              </Col>
            </Row>
          </Col>
          <Col span={isMobile ? 24 : 17}>
            <Card title="评论">
              <Skeleton active></Skeleton>
            </Card>
          </Col>
        </Row>
      ) : (
        <ErrorBoundaryOnFetch errorMsg={errorMsg} />
      )}
    </>
  )
}

export default PostDetail
