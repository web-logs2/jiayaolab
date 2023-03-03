import { EditOutlined } from '@ant-design/icons'
import { Button, Col, Row, Space, Tabs } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlobalAnnouncement from '../../components/GlobalAnnouncement'
import HeadTitle from '../../components/HeadTitle'
import PostList from '../../components/PostList'
import { POST_NEW, USER_LOGIN } from '../../constant/paths'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { PostModelType } from '../../models/post'
import {
  getPostByCategories,
  postCleared,
} from '../../store/features/postSlice'
import classes from './index.module.less'

const HomePage: FC = () => {
  const { loading, posts } = useTypedSelector(s => s.postSlice)
  const { token } = useTypedSelector(s => s.userSlice)
  // 页面大小
  const [size, setSize] = useState<number>(1)
  // 排序依据
  const [sortField, setSortField] = useState<keyof PostModelType>('updatedAt')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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
        <Col span={18}>
          <Space size="middle" className={classes.tabBar}>
            <Tabs
              onChange={key => {
                setSize(1)
                setSortField(key as keyof PostModelType)
                dispatch(postCleared())
              }}
              activeKey={sortField}
              items={[
                { key: 'createdAt', label: '最新发帖', disabled: loading },
                { key: 'updatedAt', label: '推荐', disabled: loading },
              ]}
            />
            <Button
              type="primary"
              onClick={() =>
                navigate(
                  token ? POST_NEW : `${USER_LOGIN}/?redirect=${POST_NEW}`
                )
              }
              icon={<EditOutlined />}
            >
              发布帖子
            </Button>
          </Space>
          <PostList size={size} loadMoreHandler={() => setSize(size + 1)} />
        </Col>
        <Col span={6}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <GlobalAnnouncement />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default HomePage
