import { Button, Result, Typography } from 'antd'
import React from 'react'
import { useRouteError } from 'react-router-dom'
import classes from './index.module.less'

const { Paragraph } = Typography
/**
 * 全局范围的错误边界组件
 */
const GlobalErrorBoundary: React.FC = () => {
  const error = useRouteError() as string

  return (
    <Result
      className={classes.globalErrorBoundary}
      status="error"
      title="未知错误"
      subTitle="网站在运行时发生了未知的错误，请重试或向管理员报告此问题！"
      extra={[
        <Button
          type="primary"
          key="retry"
          onClick={() => window.location.reload()}
        >
          重试
        </Button>,
        <Button
          key="report"
          href="https://github.com/zjy040525/forum/issues"
          target="_blank"
        >
          报告此问题
        </Button>,
      ]}
    >
      <Paragraph style={{ marginBlockEnd: 0 }}>{error.toString()}</Paragraph>
    </Result>
  )
}

export default GlobalErrorBoundary
