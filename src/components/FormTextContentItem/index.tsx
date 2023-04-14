import { Form } from 'antd'
import { FC, PropsWithChildren } from 'react'

/**
 * 帖子内容
 * @param children 一般放文本编辑器组件
 */
const FormTextContentItem: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Form.Item
      label="内容"
      colon={false}
      name="textContent"
      required
      rules={[
        { required: true, message: '请填写帖子内容' },
        { whitespace: true, message: '请填写帖子内容' },
        { max: 30000, message: '帖子内容不能大于30000个字符' },
      ]}
    >
      {children}
    </Form.Item>
  )
}

export default FormTextContentItem
