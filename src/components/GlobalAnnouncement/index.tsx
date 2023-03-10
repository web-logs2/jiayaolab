import { Card, Typography } from 'antd'
import { FC } from 'react'

const { Paragraph } = Typography
/**
 * 全局公告
 */
const GlobalAnnouncement: FC = () => {
  return (
    <Card title="公告">
      <Paragraph>本项目是「赵佳磊」的毕业设计，遵循MIT协议开源。</Paragraph>
      <Paragraph type="success">你可以免费使用软件</Paragraph>
      <Paragraph type="success">你可以将本项目用于商业用途</Paragraph>
      <Paragraph type="success">你可以修改项目代码</Paragraph>
      <Paragraph type="warning" style={{ marginBlockEnd: 0 }}>
        你的源文件里必须包含MIT许可证
      </Paragraph>
    </Card>
  )
}

export default GlobalAnnouncement
