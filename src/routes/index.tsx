import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import PageNotFound from '../components/PageNotFound'
import { POST, POSTS, USER } from '../constant/paths'

// 页面布局
const BasicLayout = lazy(() => import('../layouts/BasicLayout'))
const HomePage = lazy(() => import('../pages/Home'))
const PostDetail = lazy(() => import('../pages/PostDetail'))
const PostOverview = lazy(() => import('../pages/PostOverview'))
const AddNewPost = lazy(() => import('../pages/AddNewPost'))
const SignUp = lazy(() => import('../pages/SignUp'))
const SignIn = lazy(() => import('../pages/SignIn'))
const MyProfile = lazy(() => import('../pages/MyProfile'))

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
          // 不携带参数显示页面不存在
          { index: true, element: <PageNotFound /> },
          // 携带ID访问，服务器根据ID返回相应内容
          { path: ':uuid', element: <PostDetail /> },
          // 发布帖子
          { path: 'new', element: <AddNewPost /> },
          // 捕获其他任意参数，显示页面不存在
          { path: '*', element: <PageNotFound /> },
        ],
      },
      // 帖子概览
      { path: POSTS, element: <PostOverview /> },
      // 用户
      {
        path: USER,
        children: [
          { index: true, element: <PageNotFound /> },
          // 用户注册
          { path: 'register', element: <SignUp /> },
          // 用户登录
          { path: 'login', element: <SignIn /> },
          // 用户中心
          { path: ':uuid', element: <MyProfile /> },
          { path: '*', element: <PageNotFound /> },
        ],
      },
    ],
  },
] as RouteObject[]
