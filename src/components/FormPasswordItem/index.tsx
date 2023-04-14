import { Form, Input } from 'antd'
import { FC } from 'react'

/**
 * 密码输入框
 */
const FormPasswordItem: FC = () => {
  return (
    <Form.Item
      name="password"
      colon={false}
      label="密码"
      rules={[
        { required: true, message: '请填写密码' },
        { whitespace: true, message: '请填写密码' },
        { min: 8, message: '密码长度不得少于8个字符' },
        { max: 32, message: '密码长度不得大于32个字符' },
      ]}
      hasFeedback
    >
      <Input.Password maxLength={32} showCount />
    </Form.Item>
  )
}

export default FormPasswordItem
