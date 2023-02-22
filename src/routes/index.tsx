import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import PageNotFound from '../components/PageNotFound'

// 页面布局
const BasicLayout = lazy(() => import('../layouts/BasicLayout'))
const HomePage = lazy(() => import('../pages/Home'))
const PostDetail = lazy(() => import('../pages/PostDetail'))
const PostOverview = lazy(() => import('../pages/PostOverview'))
const AddNewPost = lazy(() => import('../pages/AddNewPost'))
const SignUp = lazy(() => import('../pages/SignUp'))
const SignIn = lazy(() => import('../pages/SignIn'))

export default [
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      // 主页
      { path: '/', element: <HomePage /> },
      // 帖子详情页面
      {
        path: '/post',
        children: [
          { index: true, element: <PageNotFound /> },
          { path: 'new', element: <AddNewPost /> },
          { path: '*', element: <PageNotFound /> },
          {
            path: 'detail',
            children: [
              { index: true, element: <PageNotFound /> },
              // 携带ID访问，服务器根据ID返回相应内容
              { path: ':id', element: <PostDetail /> },
              { path: '*', element: <PageNotFound /> },
            ],
          },
        ],
      },
      // 帖子概览
      { path: '/posts', element: <PostOverview /> },
      // 用户
      {
        path: '/user',
        children: [
          { index: true, element: <PageNotFound /> },
          // 用户注册
          { path: 'register', element: <SignUp /> },
          // 用户登录
          { path: 'login', element: <SignIn /> },
          // 用户中心
          { path: 'profile', element: <>Profile</> },
          { path: '*', element: <PageNotFound /> },
        ],
      },
    ],
  },
] as RouteObject[]
