import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'
import PageNotFound from '../components/PageNotFound'
import {
  POST,
  POST_LIST,
  POST_LIST_ONLY,
  POST_NEW_ONLY,
  USER,
  USER_COMMENT_LIST_ONLY,
  USER_LOGIN_ONLY,
  USER_POST_LIST_ONLY,
  USER_REGISTER_ONLY,
} from '../constant/paths'

const BasicLayout = lazy(() => import('../layouts/BasicLayout'))

const HomePage = lazy(() => import('../pages/Home'))
const PostDetail = lazy(() => import('../pages/PostDetail'))
const PostList = lazy(() => import('../pages/PostList'))
const PostNew = lazy(() => import('../pages/PostNew'))
const SignIn = lazy(() => import('../pages/SignIn'))
const SignUp = lazy(() => import('../pages/SignUp'))
const UserCommentList = lazy(() => import('../pages/UserCommentList'))
const UserInfo = lazy(() => import('../pages/UserInfo'))
const UserPostList = lazy(() => import('../pages/UserPostList'))

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
          { path: POST_LIST_ONLY, element: <PostList /> },
          // 发布帖子
          { path: POST_NEW_ONLY, element: <PostNew /> },
          // 捕获无效路径，重定向到帖子列表页面
          { path: '*', element: <Navigate to={POST_LIST} replace /> },
        ],
      },
      // 用户
      {
        path: USER,
        children: [
          // 不携带参数访问自动重定向到用户页面，用户页面会根据用户登录情况判断跳转页面
          { index: true, element: <UserInfo /> },
          // 携带参数访问，将视为用户的id，服务器根据用户ID返回相应内容
          {
            path: ':userId',
            element: <UserInfo />,
            children: [
              {
                index: true,
                element: <Navigate to={USER_POST_LIST_ONLY} replace />,
              },
              { path: USER_POST_LIST_ONLY, element: <UserPostList /> },
              { path: USER_COMMENT_LIST_ONLY, element: <UserCommentList /> },
              // 捕获无效路径，重定向到用户帖子列表页面
              {
                path: '*',
                element: <Navigate to={USER_POST_LIST_ONLY} replace />,
              },
            ],
          },
          // 用户注册
          { path: USER_REGISTER_ONLY, element: <SignUp /> },
          // 用户登录
          { path: USER_LOGIN_ONLY, element: <SignIn /> },
          // 捕获无效路径，显示页面不存在
          { path: '*', element: <PageNotFound /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
] as RouteObject[]
