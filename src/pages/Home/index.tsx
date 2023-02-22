import { LikeOutlined } from '@ant-design/icons'
import { Card, Col, Row, Tabs, Typography } from 'antd'
import { FC, ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeadTitle from '../../components/HeadTitle'
import PostList from '../../components/PostList'
import { USER_REGISTER } from '../../constant/paths'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { PostModelType } from '../../models/post'
import {
  getPostByCategories,
  postCleared,
} from '../../store/features/postSlice'

const { Text } = Typography
const HomePage: FC = () => {
  const { loading, posts } = useTypedSelector(s => s.postSlice)
  // 页面大小
  const [size, setSize] = useState<number>(1)
  // 排序依据
  const [sortField, setSortField] = useState<keyof PostModelType>('updatedAt')
  const dispatch = useAppDispatch()

  // 这个副作用钩子解决路由切换没有清除原来的数据，导致再次进入该页面重复获取数据
  // 当页面载入的时候，如果有数据，就代表是切换路由后重新访问的，这时候就需要清除原来的数据
  useEffect(() => {
    if (posts) {
      dispatch(postCleared())
    }
  }, [])
  // 当页面大小或排序依据改变时，重新获取数据！
  useEffect(() => {
    dispatch(getPostByCategories({ size, sortField }))
  }, [size, sortField])
  return (
    <>
      <HeadTitle prefix="主页" />
      <Row gutter={[16, 0]}>
        <Col span={17}>
          <Tabs
            onChange={key => {
              setSize(1)
              setSortField(key as keyof PostModelType)
              dispatch(postCleared())
            }}
            activeKey={sortField}
            items={
              [
                {
                  label: (
                    <>
                      <LikeOutlined />
                      <span>推荐</span>
                    </>
                  ),
                  key: 'updatedAt',
                  disabled: loading,
                },
              ] as {
                label: ReactNode
                key: keyof PostModelType
                disabled: boolean
              }[]
            }
          />
          <PostList size={size} loadMoreHandler={() => setSize(size + 1)} />
        </Col>
        <Col span={7}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Card title="Announcements">
                <Text type="warning">
                  用户注册限时无需邮箱验证码进行验证，只需遵循邮箱的格式即可任意注册！
                  <Link to={USER_REGISTER}>点我去注册</Link>
                </Text>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Badges">
                <Row gutter={[16, 16]}>
                  {[
                    {
                      key: 'license',
                      url: 'https://img.shields.io/github/license/zjy040525/blog?style=for-the-badge',
                    },
                    {
                      key: 'commit-activity',
                      url: 'https://img.shields.io/github/commit-activity/w/zjy040525/blog?style=for-the-badge',
                    },
                    {
                      key: 'last-commit',
                      url: 'https://img.shields.io/github/last-commit/zjy040525/blog?style=for-the-badge',
                    },
                    {
                      key: 'repo-size',
                      url: 'https://img.shields.io/github/repo-size/zjy040525/blog?style=for-the-badge',
                    },
                    {
                      key: 'stars',
                      url: 'https://img.shields.io/github/stars/zjy040525/blog?style=for-the-badge',
                    },
                    {
                      key: 'languages',
                      url: 'https://img.shields.io/github/languages/top/zjy040525/blog?style=for-the-badge',
                    },
                  ].map(({ url, key }) => (
                    <Col key={key}>
                      <img draggable={false} src={url} alt={key} />
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Deployments">
                <Row gutter={[16, 16]}>
                  {[
                    {
                      key: 'workflow-status',
                      url: 'https://img.shields.io/github/actions/workflow/status/zjy040525/blog/wechat-cloudrun.yml?style=for-the-badge',
                    },
                    {
                      key: 'production',
                      url: 'https://img.shields.io/github/deployments/zjy040525/blog/production?label=Production&style=for-the-badge',
                    },
                  ].map(({ url, key }) => (
                    <Col key={key}>
                      <img draggable={false} src={url} alt={key} />
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default HomePage
