import {
  BugOutlined,
  CopyrightOutlined,
  GithubOutlined,
  LogoutOutlined,
  MailOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  App as AntdApp,
  Avatar,
  Button,
  Col,
  Dropdown,
  Layout,
  Menu,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd'
import { FC, Suspense } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import avatar from '../../assets/avatar.png'
import HeadTitle from '../../components/HeadTitle'
import IconText from '../../components/IconText'
import {
  POSTS,
  USER,
  USER_LOGIN,
  USER_PROFILE,
  USER_REGISTER,
} from '../../constant/paths'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { removeToken } from '../../store/features/tokenOnlySlice'
import classes from './index.module.less'

const { Header, Content, Footer } = Layout
const { Text, Title, Link: AntdLink } = Typography
const BasicLayout: FC = () => {
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { token } = useTypedSelector(s => s.tokenOnlySlice)
  // 接受注册/登录前的页面，在注册/登录完成后自动跳转之前的页面
  const doRedirect = (path: string) => {
    const redirect = location.pathname.includes(USER) ? '' : location.pathname
    navigate(`${path}?redirect=${redirect}`)
  }

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
            { key: POSTS, label: '帖子' },
            { key: USER_PROFILE, label: '我的', disabled: !token },
          ]}
        />
        <div className={classes.flexGrow} />
        {token ? (
          <>
            <Button
              type="primary"
              onClick={() => navigate('/post/new')}
              icon={<UploadOutlined />}
            >
              发帖
            </Button>
            <Dropdown
              destroyPopupOnHide
              trigger={['click', 'hover']}
              placement="bottom"
              menu={{
                items: [
                  {
                    key: 'profile',
                    label: '个人中心',
                    icon: <UserOutlined />,
                    onClick: () => navigate(USER_PROFILE),
                  },
                  { type: 'divider' },
                  {
                    key: 'logout',
                    label: '注销',
                    icon: <LogoutOutlined />,
                    onClick: () => {
                      dispatch(removeToken())
                      // 注销后返回主页
                      if (location.pathname.includes(USER_PROFILE)) {
                        navigate('/')
                      }
                      message.warning('已注销！')
                    },
                    danger: true,
                  },
                ],
              }}
            >
              <Avatar
                className={classes.avatar}
                icon={<UserOutlined />}
                draggable={false}
              />
            </Dropdown>
          </>
        ) : (
          <Space>
            <Button type="primary" onClick={() => doRedirect(USER_REGISTER)}>
              注册
            </Button>
            <Button type="default" onClick={() => doRedirect(USER_LOGIN)}>
              登录
            </Button>
          </Space>
        )}
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
