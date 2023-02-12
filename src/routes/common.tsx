import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import PageNotFound from '../components/PageNotFound'

const HomePage = lazy(() => import('../pages/Home'))
const PostDetail = lazy(() => import('../pages/PostDetail'))
const PostOverview = lazy(() => import('../pages/PostOverview'))
const AddNewPost = lazy(() => import('../pages/AddNewPost'))

/**
 * 一般路由，所有人都可以访问。
 */
const commonRoutes: RouteObject[] = [
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
]

export default commonRoutes
