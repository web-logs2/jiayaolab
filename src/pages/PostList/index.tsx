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
import { FC, useState } from 'react'
import HeadTitle from '../../components/HeadTitle'
import PostPreviewList from '../../components/PostPreviewList'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { OrderByModuleType } from '../../models/orderBy'
import { PostModelType } from '../../models/post'
import {
  clearPostList,
  getPostBySearch,
  setFetchSize,
} from '../../store/features/postSlice'

const { useBreakpoint } = Grid
const { Text } = Typography
const PostList: FC = () => {
  const { loading } = useTypedSelector(s => s.postSlice)
  const [sortField, setSortField] = useState<keyof PostModelType>('updatedAt')
  const [sortOrder, setSortOrder] = useState<OrderByModuleType>('DESC')
  const [keywords, setKeywords] = useState<string>('')
  const dispatch = useAppDispatch()
  const { xs, lg } = useBreakpoint()
  const isMobile = xs || !lg
  const fetchPostHandler = () =>
    dispatch(getPostBySearch({ sortField, sortOrder, keywords }))
  // 搜索按钮
  const searchHandler = () => {
    // 清空帖子列表
    dispatch(clearPostList())
    // 重置获取帖子页面大小
    dispatch(setFetchSize(1))
    // 执行获取帖子处理程序
    fetchPostHandler()
  }
  // 重置按钮
  const resetHandler = () => {
    // 重置获取帖子页面大小
    dispatch(setFetchSize(1))
    // 重置排序依据
    setSortField('updatedAt')
    // 重置排序方式
    setSortOrder('DESC')
    // 重置关键字
    setKeywords('')
  }

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
            <PostPreviewList fetchPostHandler={fetchPostHandler} />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default PostList
