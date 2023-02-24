import {
  CalendarOutlined,
  FileOutlined,
  LikeOutlined,
  StarOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Divider,
  Row,
  Skeleton,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorBoundaryOnFetch from '../../components/ErrorBoundaryOnFetch'
import HeadTitle from '../../components/HeadTitle'
import IconText from '../../components/IconText'
import { PostModelType } from '../../models/post'
import { fetchPostById } from '../../services/post'
import { formatDate, fromNowDate } from '../../utils/format'

const { Title, Text, Paragraph } = Typography
const PostDetail: FC = () => {
  // 帖子ID
  const { id } = useParams<{ id: string }>()
  // 帖子详情
  const [postDetail, setPostDetail] = useState<PostModelType | null>(null)
  // 获取帖子详情中
  const [loading, setLoading] = useState<boolean>(true)
  // 获取帖子详情时出现的错误
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // 匹配到路由，当有id参数时执行钩子
  useEffect(() => {
    if (id) {
      fetchPostById(id)
        .then(({ data }) => setPostDetail(data))
        .catch(err => setErrorMsg(err.message))
        .finally(() => setLoading(false))
    }
  }, [id])
  return (
    <>
      <HeadTitle prefix={postDetail?.title ? postDetail.title : '帖子详情'} />
      {loading || postDetail ? (
        <Row gutter={[16, 16]}>
          <Col span={18}>
            <Card>
              <Skeleton active loading={loading}>
                <Title level={3}>{postDetail?.title}</Title>
                <Divider />
                <Paragraph>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: postDetail?.html || '',
                    }}
                  />
                </Paragraph>
              </Skeleton>
            </Card>
          </Col>
          <Col span={6}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Card>
                  <Row gutter={[32, 0]} align="middle">
                    <Col span={8}>
                      <Skeleton
                        avatar={{ shape: 'circle' }}
                        title={false}
                        paragraph={false}
                        active
                        loading={loading}
                      >
                        <IconText
                          icon={
                            <Tooltip title="点赞">
                              <Button
                                shape="circle"
                                type="default"
                                icon={<LikeOutlined />}
                                size="large"
                              />
                            </Tooltip>
                          }
                          text={<Text>{0}</Text>}
                        />
                      </Skeleton>
                    </Col>
                    <Col span={8}>
                      <Skeleton
                        avatar={{ shape: 'circle' }}
                        title={false}
                        paragraph={false}
                        active
                        loading={loading}
                      >
                        <IconText
                          icon={
                            <Tooltip title="收藏">
                              <Button
                                shape="circle"
                                type="default"
                                icon={<StarOutlined />}
                                size="large"
                              />
                            </Tooltip>
                          }
                          text={<Text>{0}</Text>}
                        />
                      </Skeleton>
                    </Col>
                    <Col span={8}>
                      {loading ? (
                        <Skeleton.Button active />
                      ) : (
                        <Button type="primary" danger>
                          举报
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card title="帖子信息">
                  <Skeleton active loading={loading}>
                    <Row gutter={[0, 16]}>
                      {[
                        {
                          label: '帖子ID',
                          icon: <FileOutlined />,
                          value: postDetail?.uuid,
                        },
                        {
                          label: '最后更新于',
                          icon: <CalendarOutlined />,
                          value: (
                            <>
                              {formatDate(postDetail?.updatedAt)}
                              <Text type="secondary">
                                （{fromNowDate(postDetail?.updatedAt)}）
                              </Text>
                            </>
                          ),
                        },
                        {
                          label: '帖子发布于',
                          icon: <CalendarOutlined />,
                          value: (
                            <>
                              {formatDate(postDetail?.createdAt)}
                              <Text type="secondary">
                                （{fromNowDate(postDetail?.createdAt)}）
                              </Text>
                            </>
                          ),
                        },
                      ].map(({ value, label, icon }) => (
                        <Col key={label} span={24}>
                          <IconText
                            icon={icon}
                            text={
                              <Space size="middle">
                                <Text>{label}</Text>
                                <Text>{value}</Text>
                              </Space>
                            }
                          />
                        </Col>
                      ))}
                    </Row>
                  </Skeleton>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
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
