import { Card, Typography } from 'antd'
import { FC } from 'react'

const { Paragraph, Link } = Typography
/**
 * 全局公告
 */
const GlobalAnnouncement: FC = () => {
  return (
    <Card title="公告">
      <Paragraph>
        本项目（佳垚的论坛）是由「赵佳磊」独立全栈开发的毕业设计，使用
        <Link href="https://opensource.org/license/mit/" target="_blank">
          MIT
        </Link>
        协议开源。
      </Paragraph>
      <Paragraph type="success">你可以免费使用软件</Paragraph>
      <Paragraph type="success">你可以将本项目用于商业用途</Paragraph>
      <Paragraph type="success" style={{ marginBlockEnd: 0 }}>
        你可以修改项目源代码
      </Paragraph>
    </Card>
  )
}

export default GlobalAnnouncement
