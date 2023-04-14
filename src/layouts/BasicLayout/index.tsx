import {
  BugOutlined,
  CopyrightOutlined,
  EditOutlined,
  FileTextOutlined,
  GithubOutlined,
  HomeOutlined,
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
  Grid,
  Layout,
  Menu,
  Row,
  Space,
  Typography,
} from 'antd'
import { FC, Suspense } from 'react'
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import avatar from '../../assets/avatar.png'
import ChunkLoading from '../../components/ChunkLoading'
import FlexGrow from '../../components/FlexGrow'
import HeadTitle from '../../components/HeadTitle'
import IconText from '../../components/IconText'
import {
  UNAUTHORIZED_POST_NEW_KEY,
  UNAUTHORIZED_USER_INFO_KEY,
} from '../../constant/messageKeys'
import {
  POST_LIST,
  POST_NEW,
  USER,
  USER_LOGIN,
  USER_POST_LIST_ONLY,
  USER_REGISTER,
} from '../../constant/paths'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { logout } from '../../store/features/userSlice'
import { urlRedirect } from '../../utils/redirect'
import classes from './index.module.less'

const { Header, Content, Footer } = Layout
const { Text, Title, Link: AntdLink } = Typography
const { useBreakpoint } = Grid
const BasicLayout: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { message } = AntdApp.useApp()
  const dispatch = useAppDispatch()
  const [params] = useSearchParams()
  const { loginUserId } = useTypedSelector(s => s.userSlice)
  const { xs, lg } = useBreakpoint()
  const isMobile = xs || !lg
  // 接受点击 注册/登录 前的页面，在 注册/登录 完成后自动跳转之前的页面
  // 注册/登录 页面两者切换时不会顶掉原先的页面
  const redirectHandler = (path: string) => {
    const pathname =
      location.pathname.includes(USER_REGISTER) ||
      location.pathname.includes(USER_LOGIN)
        ? ''
        : location.pathname
    navigate(urlRedirect(path, params.get('redirect') || pathname))
  }
  const USER_KEY_ONLY = `${USER}/${loginUserId}`
  const USER_KEY_FULL = `${USER_KEY_ONLY}/${USER_POST_LIST_ONLY}`

  return (
    <Layout style={{ minWidth: 360 }}>
      <HeadTitle />
      <Header className={classes.header}>
        <div style={{ marginInlineEnd: isMobile ? 25 : 50 }}>
          <Link to="/" className={classes.navigate}>
            <img src={avatar} alt="" draggable={false} width={32} height={32} />
            <Title className={classes.title} level={5} hidden={xs}>
              佳垚的论坛
            </Title>
          </Link>
        </div>
        <Menu
          className={classes.menu}
          mode="horizontal"
          selectedKeys={[
            // 因为用户信息页面还有其他子页面，所以这里要判断
            // 当前路径是否包含登录用户，如果包含登录用户则
            // 菜单中 我的 变成选中状态
            location.pathname.includes(USER_KEY_ONLY)
              ? USER_KEY_ONLY
              : location.pathname,
          ]}
          onSelect={e => {
            if (e.key === UNAUTHORIZED_POST_NEW_KEY) {
              message.open({
                key: UNAUTHORIZED_POST_NEW_KEY,
                type: 'error',
                content: '登录后才能发布帖子！',
              })
              navigate(urlRedirect(USER_LOGIN, POST_NEW))
            } else if (e.key === UNAUTHORIZED_USER_INFO_KEY) {
              message.open({
                key: UNAUTHORIZED_USER_INFO_KEY,
                type: 'error',
                content: '请先登录！',
              })
              navigate(urlRedirect(USER_LOGIN, USER))
            } else if (e.key === USER_KEY_ONLY) {
              navigate(USER_KEY_FULL)
            } else {
              navigate(e.key)
            }
          }}
          items={[
            { icon: <HomeOutlined />, key: '/', label: '主页' },
            { icon: <FileTextOutlined />, key: POST_LIST, label: '帖子' },
            {
              icon: <EditOutlined />,
              key: loginUserId ? POST_NEW : UNAUTHORIZED_POST_NEW_KEY,
              label: '发帖',
            },
            {
              icon: <UserOutlined />,
              key: loginUserId ? USER_KEY_ONLY : UNAUTHORIZED_USER_INFO_KEY,
              label: '我的',
            },
          ]}
        />
        <FlexGrow />
        {loginUserId ? (
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
                  onClick: () => navigate(USER_KEY_FULL),
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
            <Button
              type="primary"
              onClick={() => redirectHandler(USER_REGISTER)}
            >
              注册
            </Button>
            <Button type="default" onClick={() => redirectHandler(USER_LOGIN)}>
              登录
            </Button>
          </Space>
        )}
      </Header>
      <Content
        className={classes.content}
        style={{ paddingInline: isMobile ? 10 : 50 }}
      >
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
