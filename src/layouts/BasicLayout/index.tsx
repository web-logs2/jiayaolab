import {
  BugOutlined,
  CopyrightOutlined,
  GithubOutlined,
  LogoutOutlined,
  MailOutlined,
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
  Typography,
} from 'antd'
import { FC, Suspense, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import avatar from '../../assets/avatar.png'
import ChunkLoading from '../../components/ChunkLoading'
import FlexGrow from '../../components/FlexGrow'
import HeadTitle from '../../components/HeadTitle'
import IconText from '../../components/IconText'
import {
  POST_LIST,
  USER,
  USER_LOGIN,
  USER_POST_LIST_ONLY,
  USER_REGISTER,
} from '../../constant/paths'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { verityToken } from '../../services/user'
import { logout } from '../../store/features/userSlice'
import { urlRedirect } from '../../utils/redirect'
import classes from './index.module.less'

const { Header, Content, Footer } = Layout
const { Text, Title, Link: AntdLink } = Typography
const BasicLayout: FC = () => {
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { token, loginUserId } = useTypedSelector(s => s.userSlice)
  // 接受注册/登录前的页面，在注册/登录完成后自动跳转之前的页面
  const doRedirect = (path: string) => {
    const isAuthPage =
      location.pathname.includes(USER_REGISTER) ||
      location.pathname.includes(USER_LOGIN)
        ? ''
        : location.pathname
    navigate(urlRedirect(path, isAuthPage))
  }
  const userMenuKey = `${USER}/${loginUserId}`
  const userPostListLink = `${userMenuKey}/${USER_POST_LIST_ONLY}`

  // 验证token
  useEffect(() => {
    if (token) {
      verityToken()
        .then(({ data }) => {
          // 判断验证成功后的用户id是否匹配本地存储中的用户id
          if (data.userId !== loginUserId) {
            dispatch(logout())
          }
        })
        .catch(err => {
          // 验证失败，退出当前登录状态，要求重新登录
          dispatch(logout())
          message.error(err.message)
        })
    }
  }, [token])
  return (
    <Layout>
      <HeadTitle />
      <Header className={classes.header}>
        <div style={{ marginInlineEnd: 50 }}>
          <Link to="/" className={classes.navigate}>
            <img src={avatar} alt="" draggable={false} width={32} height={32} />
            <Title className={classes.title} level={5}>
              佳垚的论坛
            </Title>
          </Link>
        </div>
        <Menu
          className={classes.menu}
          mode="horizontal"
          selectedKeys={[
            location.pathname.includes(userMenuKey)
              ? userMenuKey
              : location.pathname,
          ]}
          onSelect={e => {
            // 手动跳转到用户帖子列表页面，虽然路由表里定义过了自动跳转到用户帖子页面，但总感觉不太好
            navigate(e.key === userMenuKey ? userPostListLink : e.key)
          }}
          items={[
            { key: '/', label: '主页' },
            { key: POST_LIST, label: '帖子' },
            {
              key: token && loginUserId ? userMenuKey : USER,
              label: '我的',
              disabled: !token,
            },
          ]}
        />
        <FlexGrow />
        {token ? (
          <Dropdown
            destroyPopupOnHide
            trigger={['click']}
            placement="bottom"
            menu={{
              items: [
                {
                  key: 'user',
                  label: '我的',
                  icon: <UserOutlined />,
                  onClick: () => navigate(userPostListLink),
                },
                { type: 'divider' },
                {
                  key: 'logout',
                  label: '退出登录',
                  icon: <LogoutOutlined />,
                  onClick: () => {
                    dispatch(logout())
                    // 退出登录后如果在用户相关页面，则需要返回主页
                    if (location.pathname.includes(USER)) {
                      navigate('/')
                    }
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
        <Suspense fallback={<ChunkLoading />}>
          <Outlet />
        </Suspense>
      </Content>
      <Footer className={classes.footer}>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Row gutter={[32, 0]} justify="center">
              {[
                {
                  link: 'https://github.com/zjy040525/forum',
                  icon: <GithubOutlined />,
                  text: '项目源码',
                },
                {
                  link: 'https://github.com/zjy040525/forum/issues',
                  icon: <BugOutlined />,
                  text: '问题反馈',
                },
                {
                  link: 'https://github.com/zjy040525/forum/issues',
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
