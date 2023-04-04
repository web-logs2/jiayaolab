import { App as AntdApp, ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import locale from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider as ReduxProvider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import GlobalLoading from './components/GlobalLoading'
import VerifyToken from './components/VerifyToken'
import routes from './routes'
import store from './store'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <HelmetProvider>
        <ConfigProvider locale={locale}>
          <AntdApp>
            <Suspense fallback={<GlobalLoading />}>
              <VerifyToken />
              <RouterProvider router={createBrowserRouter(routes)} />
            </Suspense>
          </AntdApp>
        </ConfigProvider>
      </HelmetProvider>
    </ReduxProvider>
  </StrictMode>
)
