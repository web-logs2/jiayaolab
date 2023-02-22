import { Button, Result } from 'antd'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import classes from './index.module.less'

/**
 * 页面不存在
 */
const PageNotFound: FC = () => {
  return (
    <Result
      className={classes.pageNotFound}
      status={404}
      title="走丢了"
      subTitle="抱歉，找不到你需要的页面"
      extra={
        <Button type="primary">
          <Link to="/" replace>
            返回主页
          </Link>
        </Button>
      }
    />
  )
}

export default PageNotFound
