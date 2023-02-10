import {
  BugOutlined,
  CopyrightOutlined,
  GithubOutlined,
  MailOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Button, Col, Layout, Menu, Row, Spin, Typography } from 'antd'
import { FC, Suspense } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import avatar from '../../assets/avatar.png'
import HeadTitle from '../../components/HeadTitle'
import IconText from '../../components/IconText'
import classes from './index.module.less'

const { Text, Title, Link: AntdLink } = Typography
const BasicLayout: FC = () => {
  const { Header, Content, Footer } = Layout
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Layout>
      <HeadTitle />
      <Header className={classes.header}>
        <div className={classes.index}>
          <Link to="/" className={classes.navigate}>
            <img src={avatar} alt="" draggable={false} width={32} height={32} />
            <Title className={classes.title} level={5}>
              佳垚的博客
            </Title>
          </Link>
        </div>
        <Menu
          className={classes.menu}
          mode="horizontal"
          selectedKeys={[location.pathname]}
          onSelect={e => navigate(e.key)}
          items={[
            { key: '/', label: '主页' },
            { key: '/posts', label: '帖子' },
            { key: '/profile', label: '我的', disabled: true },
          ]}
        />
        <div className={classes.flexGrow} />
        <Button
          type="primary"
          onClick={() => navigate('/publish')}
          hidden={location.pathname === '/publish'}
          disabled={location.pathname === '/publish'}
          icon={<UploadOutlined />}
        >
          发帖
        </Button>
      </Header>
      <Content className={classes.content}>
        <Suspense
          fallback={
            <div className={classes.spinner}>
              <Spin />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </Content>
      <Footer className={classes.footer}>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Row gutter={[32, 0]} justify="center">
              {[
                {
                  link: 'https://github.com/zjy040525/blog',
                  icon: <GithubOutlined />,
                  text: '项目源码',
                },
                {
                  link: 'https://github.com/zjy040525/blog/issues',
                  icon: <BugOutlined />,
                  text: '问题反馈',
                },
                {
                  link: 'https://github.com/zjy040525/blog/issues',
                  icon: <MailOutlined />,
                  text: '联系我们',
                },
              ].map(({ link, text, icon }) => (
                <Col key={text}>
                  <AntdLink href={link} target="_blank" type="secondary">
                    <IconText icon={icon} text={text} />
                  </AntdLink>
                </Col>
              ))}
            </Row>
          </Col>
          <Col span={24}>
            <Text type="secondary">
              Copyright <CopyrightOutlined /> 2023{' '}
              <AntdLink href="https://github.com/hnjx-studios" target="_blank">
                Haining Technician Institute Studios
              </AntdLink>
              . All rights reserved.
            </Text>
          </Col>
        </Row>
      </Footer>
    </Layout>
  )
}

export default BasicLayout
