import { App as AntdApp, ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import locale from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import 'react-quill/dist/quill.snow.css'
import { Provider as ReduxProvider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import GlobalLoading from './components/GlobalLoading'
import routes from './routes'
import store from './store'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <HelmetProvider>
        <ConfigProvider locale={locale}>
          <AntdApp>
            <React.Suspense fallback={<GlobalLoading />}>
              <RouterProvider router={createBrowserRouter(routes)} />
            </React.Suspense>
          </AntdApp>
        </ConfigProvider>
      </HelmetProvider>
    </ReduxProvider>
  </React.StrictMode>
)
