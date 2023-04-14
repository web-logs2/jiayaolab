import { Form, Input } from 'antd'
import { FC } from 'react'

/**
 * 邮箱输入框
 */
const FormEmailItem: FC = () => {
  return (
    <Form.Item
      name="email"
      colon={false}
      label="邮箱"
      rules={[
        { required: true, message: '请填写邮箱' },
        { whitespace: true, message: '请填写邮箱' },
        { max: 50, message: '邮箱长度不得大于50个字符' },
        {
          pattern:
            /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
          message: '邮箱格式不正确',
        },
      ]}
      hasFeedback
    >
      <Input autoFocus maxLength={50} showCount />
    </Form.Item>
  )
}

export default FormEmailItem
