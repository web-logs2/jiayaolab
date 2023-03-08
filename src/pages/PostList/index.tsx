import { SearchOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Grid,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'
import { FC, useEffect, useState } from 'react'
import HeadTitle from '../../components/HeadTitle'
import PostPreviewList from '../../components/PostPreviewList'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { OrderByModuleType } from '../../models/orderBy'
import { PostModelType } from '../../models/post'
import {
  getPostByConditions,
  postCleared,
} from '../../store/features/postSlice'

const { useBreakpoint } = Grid
const { Text } = Typography
const PostList: FC = () => {
  const { loading, posts } = useTypedSelector(s => s.postSlice)
  // 页面大小
  const [size, setSize] = useState<number>(1)
  // 排序依据
  const [sortField, setSortField] = useState<keyof PostModelType>('updatedAt')
  // 排序方式
  const [sortOrder, setSortOrder] = useState<OrderByModuleType>('DESC')
  // 关键字
  const [keywords, setKeywords] = useState<string>('')
  const dispatch = useAppDispatch()
  const { xs, lg } = useBreakpoint()
  const isMobile = xs || !lg
  // 搜索按钮
  const searchHandler = () => {
    setSize(1)
    dispatch(postCleared())
    dispatch(getPostByConditions({ size: 1, sortField, sortOrder, keywords }))
  }
  // 重置按钮
  const resetHandler = () => {
    setSize(1)
    setSortField('updatedAt')
    setSortOrder('DESC')
    setKeywords('')
  }

  // 这个钩子作用和HomePage里的作用类似，都是载入页面清除原来的数据
  // 页面载入后，进行一次数据获取操作
  useEffect(() => {
    if (posts) {
      dispatch(postCleared())
    }
    dispatch(getPostByConditions({ size, sortField, sortOrder, keywords }))
  }, [])
  // 处理点击查看更多按钮的操作，这里用了if判断解决了搜索按钮和重置按钮点击后改变size导致这里的钩子获取数据的问题
  // （PS：这个钩子正常执行应该只能在点击查看更多按钮后）
  useEffect(() => {
    if (size > 1) {
      dispatch(getPostByConditions({ size, sortField, sortOrder, keywords }))
    }
  }, [size])
  // 点击查看更多按钮
  return (
    <>
      <HeadTitle layers={['帖子']} />
      <div>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Card>
              <Row align="middle" gutter={[32, isMobile ? 16 : 0]}>
                <Col span={isMobile ? 24 : 6}>
                  <Space>
                    <Text>排序依据</Text>
                    <Select
                      value={sortField}
                      disabled={loading}
                      onChange={key => setSortField(key)}
                      options={
                        [
                          { value: 'updatedAt', label: '最近更新' },
                          { value: 'createdAt', label: '最近发布' },
                        ] as { value: keyof PostModelType; label: string }[]
                      }
                    />
                  </Space>
                </Col>
                <Col span={isMobile ? 24 : 6}>
                  <Space>
                    <Text>排序方式</Text>
                    <Radio.Group
                      disabled={loading}
                      value={sortOrder}
                      optionType="button"
                      onChange={radio => setSortOrder(radio.target.value)}
                      options={
                        [
                          { value: 'ASC', label: '升序' },
                          { value: 'DESC', label: '降序' },
                        ] as { value: OrderByModuleType; label: string }[]
                      }
                    />
                  </Space>
                </Col>
                <Col span={isMobile ? 24 : 6}>
                  <Input
                    allowClear
                    value={keywords}
                    placeholder="请输入想要搜索的任意关键字"
                    disabled={loading}
                    onChange={input => setKeywords(input.target.value)}
                    onPressEnter={searchHandler}
                  />
                </Col>
                <Col span={isMobile ? 24 : 6}>
                  <Space>
                    <Button
                      type="primary"
                      loading={loading}
                      icon={<SearchOutlined />}
                      onClick={searchHandler}
                    >
                      搜索
                    </Button>
                    <Button
                      danger
                      type="primary"
                      disabled={loading}
                      onClick={resetHandler}
                    >
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <PostPreviewList
              size={size}
              loadMoreHandler={() => setSize(size + 1)}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default PostList
