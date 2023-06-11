import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'
import GlobalErrorBoundary from '../components/GlobalErrorBoundary'
import PageNotFound from '../components/PageNotFound'
import {
  POST,
  POST_EDIT_ONLY,
  POST_LIST,
  POST_LIST_ONLY,
  POST_NEW_ONLY,
  USER,
  USER_COMMENT_LIST_ONLY,
  USER_LOGIN_ONLY,
  USER_POST_LIST_ONLY,
  USER_REGISTER_ONLY,
  USER_SETTINGS_ONLY,
} from '../constant/paths'

const BasicLayout = lazy(() => import('../layouts/BasicLayout'))

const HomePage = lazy(() => import('../pages/Home'))
const PostDetail = lazy(() => import('../pages/PostDetail'))
const PostEdit = lazy(() => import('../pages/PostEdit'))
const PostList = lazy(() => import('../pages/PostList'))
const PostNew = lazy(() => import('../pages/PostNew'))
const SignIn = lazy(() => import('../pages/SignIn'))
const SignUp = lazy(() => import('../pages/SignUp'))
const UserCommentList = lazy(() => import('../pages/UserCommentList'))
const UserInfo = lazy(() => import('../pages/UserInfo'))
const UserPostList = lazy(() => import('../pages/UserPostList'))
const UserSettings = lazy(() => import('../pages/UserSettings'))

export default [
  {
    path: '/',
    element: <BasicLayout />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      // 主页
      { path: '/', element: <HomePage /> },
      // 帖子相关页面
      {
        path: POST,
        children: [
          // 不携带参数访问自动重定向到帖子列表页面
          { index: true, element: <Navigate to={POST_LIST} replace /> },
          // 帖子列表
          { path: POST_LIST_ONLY, element: <PostList /> },
          // 发布帖子
          { path: POST_NEW_ONLY, element: <PostNew /> },
          // 携带帖子id访问
          {
            path: ':postId',
            children: [
              // 默认展示帖子内容
              { index: true, element: <PostDetail /> },
              // 编辑帖子内容
              { path: POST_EDIT_ONLY, element: <PostEdit /> },
            ],
          },
        ],
      },
      // 用户
      {
        path: USER,
        children: [
          // 不携带参数访问自动重定向到用户页面，用户页面会根据用户登录情况判断跳转页面
          { index: true, element: <UserInfo /> },
          // 用户注册
          { path: USER_REGISTER_ONLY, element: <SignUp /> },
          // 用户登录
          { path: USER_LOGIN_ONLY, element: <SignIn /> },
          // 携带用户id访问，服务器根据用户id返回相应内容
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
              { path: USER_SETTINGS_ONLY, element: <UserSettings /> },
              // 捕获无效路径，重定向到用户帖子列表页面
              {
                path: '*',
                element: <Navigate to={USER_POST_LIST_ONLY} replace />,
              },
            ],
          },
        ],
      },
      // 页面不存在
      { path: '*', element: <PageNotFound /> },
    ],
  },
] as RouteObject[]
