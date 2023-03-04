import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'
import PageNotFound from '../components/PageNotFound'
import { POST, POST_LIST, USER } from '../constant/paths'

const BasicLayout = lazy(() => import('../layouts/BasicLayout'))

const HomePage = lazy(() => import('../pages/Home'))
const PostDetail = lazy(() => import('../pages/PostDetail'))
const PostList = lazy(() => import('../pages/PostList'))
const PostNew = lazy(() => import('../pages/PostNew'))
const SignIn = lazy(() => import('../pages/SignIn'))
const SignUp = lazy(() => import('../pages/SignUp'))
const User = lazy(() => import('../pages/User'))

export default [
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      // 主页
      { path: '/', element: <HomePage /> },
      // 帖子相关页面
      {
        path: POST,
        children: [
          // 不携带参数访问自动重定向到帖子列表页面
          { index: true, element: <Navigate to={POST_LIST} replace /> },
          // 携带参数访问，将视为帖子的id，服务器根据帖子ID返回相应内容
          { path: ':postId', element: <PostDetail /> },
          // 帖子列表
          { path: 'list', element: <PostList /> },
          // 发布帖子
          { path: 'new', element: <PostNew /> },
          // 捕获无效路径，重定向到帖子列表页面
          { path: '*', element: <Navigate to={POST_LIST} replace /> },
        ],
      },
      // 用户
      {
        path: USER,
        children: [
          // 不携带参数访问自动重定向到用户页面，用户页面会根据用户登录情况判断跳转页面
          { index: true, element: <User /> },
          // 携带参数访问，将视为用户的id，服务器根据用户ID返回相应内容
          { path: ':userId', element: <User /> },
          // 用户注册
          { path: 'register', element: <SignUp /> },
          // 用户登录
          { path: 'login', element: <SignIn /> },
          // 捕获无效路径，显示页面不存在
          { path: '*', element: <PageNotFound /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
] as RouteObject[]
