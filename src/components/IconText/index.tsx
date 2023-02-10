import { Space } from 'antd'
import { FC, ReactNode } from 'react'

/**
 * 图标文本
 * @param icon 图标，也可以是自定义组件
 * @param text 文本信息，也可以是自定义组件
 */
const IconText: FC<{ icon: ReactNode; text: ReactNode }> = ({ icon, text }) => (
  <Space>
    {icon}
    {text}
  </Space>
)

export default IconText
