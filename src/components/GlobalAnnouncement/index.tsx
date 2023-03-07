import { Card, Typography } from 'antd'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { USER_REGISTER } from '../../constant/paths'

const { Paragraph } = Typography
/**
 * 全局公告
 */
const GlobalAnnouncement: FC = () => {
  return (
    <Card title="公告">
      <Paragraph style={{ marginBlockEnd: 0 }}>
        用户注册无需邮箱验证码验证，任意邮箱均可注册！
        <Link to={USER_REGISTER}>点我去注册</Link>
      </Paragraph>
    </Card>
  )
}

export default GlobalAnnouncement
