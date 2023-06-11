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
import PageNotFound from '../../components/PageNotFound'
import PostEditInfo from '../../components/PostEditInfo'
import TagList from '../../components/TagList'
import UserPreviewCard from '../../components/UserPreviewCard'
import { POST, POST_EDIT_ONLY } from '../../constant/paths'
import { useTypedSelector } from '../../hook'
import { PostModelType } from '../../models/post'
import { getPostById } from '../../services/post'
import uuidTest from '../../utils/uuidTest'
import classes from './index.module.less'

const { useBreakpoint } = Grid
const { Title, Text, Paragraph } = Typography
const PostDetail: FC = () => {
  // 帖子id
  const { postId } = useParams<{ postId: string }>()
  const { xs, lg } = useBreakpoint()
  const isMobile = xs || !lg
  const { loginUserId } = useTypedSelector(s => s.userSlice)
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
  // 获取帖子详细信息的处理函数
  const getPostByIdHandler = () => {
    if (postId) {
      // 开始加载，确保验证【当前登录用户是否是该帖子的所有者】不会显示加载中组件
      setLoading(true)
      // 如果有错误信息则清除，确保验证【当前登录用户是否是该帖子的所有者】
      // 即使帖子正常获取了也会显示上一个的错误信息
      errorMsg && setErrorMsg(null)
      getPostById(postId)
        .then(({ data }) => setPostDetail(data))
        .catch(err => setErrorMsg(err.message))
        .finally(() => setLoading(false))
    }
  }

  // 匹配到路由，当有id参数时执行钩子
  useEffect(() => {
    getPostByIdHandler()
  }, [postId])
  // 验证当前登录用户是否是该帖子的所有者
  useEffect(() => {
    // 获取到帖子并且这是一篇仅自己可见的帖子
    // 判断该帖子所有者是否是当前登录用户
    if (
      postDetail &&
      postDetail._private &&
      postDetail.user.uuid !== loginUserId
    ) {
      // 重新获取帖子，这时候返回的应该是空data，并且返回消息：该帖子仅作者可见！
      getPostByIdHandler()
    }
  }, [postDetail, loginUserId])
  if (errorMsg) {
    return <ErrorBoundaryOnFetch errorMsg={errorMsg} />
  }
  return (
    <>
      <HeadTitle layers={[postDetail?.title, '帖子详情']} />
      <Row gutter={[16, 16]}>
        <Col span={isMobile ? 24 : 17}>
          <Card className={classes.card}>
            <div>
              <Skeleton
                active
                loading={loading}
                title={{ className: classes.titleLoading }}
                paragraph={{ rows: 1, className: classes.editTimeLoading }}
              >
                <Title level={3} className={classes.title}>
                  {postDetail?.title}
                </Title>
                <div className={classes.postEditInfo}>
                  <PostEditInfo post={postDetail} />
                </div>
              </Skeleton>
              <Skeleton
                active
                loading={loading}
                paragraph={{ style: { marginBlockEnd: 48 } }}
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
              <Skeleton
                loading={loading}
                title={{ width: '100%', style: { marginBlockEnd: 0 } }}
                paragraph={false}
              >
                <TagList tags={postDetail?.tags || []} />
              </Skeleton>
              <Divider />
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
                      text={<Text type="secondary">0</Text>}
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
                      text={<Text type="secondary">0</Text>}
                    />
                  </LoadingButton>
                </Space>
                <div className={classes.handle}>
                  {loading ? (
                    <>
                      <Skeleton.Button active />
                      <Divider type="vertical" />
                      <Skeleton.Button active />
                    </>
                  ) : (
                    <>
                      {postDetail?.user.uuid === loginUserId && (
                        <>
                          <Button
                            type="link"
                            href={`${POST}/${postDetail?.uuid}/${POST_EDIT_ONLY}`}
                          >
                            编辑
                          </Button>
                          <Divider type="vertical" />
                        </>
                      )}
                      <Button type="text" danger>
                        举报
                      </Button>
                    </>
                  )}
                </div>
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
    </>
  )
}

// 判断帖子id是否符合规则，减少服务器压力
const PostDetailWrapper: FC = () => {
  // 帖子id
  const { postId } = useParams<{ postId: string }>()
  return postId && uuidTest(postId) ? <PostDetail /> : <PageNotFound />
}

export default PostDetailWrapper
