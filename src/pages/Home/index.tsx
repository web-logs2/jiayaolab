import { Col, Grid, Row } from 'antd'
import { FC } from 'react'
import GlobalAnnouncement from '../../components/GlobalAnnouncement'
import HeadTitle from '../../components/HeadTitle'
import PostPreviewList from '../../components/PostPreviewList'
import { useAppDispatch } from '../../hook'
import { getPostByField } from '../../store/features/postSlice'

const { useBreakpoint } = Grid
const HomePage: FC = () => {
  const dispatch = useAppDispatch()
  const { xs, lg } = useBreakpoint()
  const isMobile = xs || !lg

  return (
    <>
      <HeadTitle layers={['主页']} />
      <Row gutter={[16, 16]}>
        <Col span={isMobile ? 24 : 17}>
          <PostPreviewList
            fetchPostHandler={() => dispatch(getPostByField('updatedAt'))}
          />
        </Col>
        <Col span={isMobile ? 24 : 7}>
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
