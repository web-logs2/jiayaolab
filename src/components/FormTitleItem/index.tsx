import { Form, Input } from 'antd'
import { ChangeEvent, FC } from 'react'

const FormTitleItem: FC<{
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}> = ({ onChange }) => {
  return (
    <Form.Item
      label="标题"
      colon={false}
      name="title"
      rules={[
        { required: true, message: '请填写帖子标题' },
        { whitespace: true, message: '请填写帖子标题' },
        { max: 30, message: '帖子标题不能大于30个字符' },
      ]}
    >
      <Input
        autoFocus
        placeholder="标题（必填）"
        onPressEnter={e => e.preventDefault()}
        onChange={onChange}
        showCount
        maxLength={30}
      />
    </Form.Item>
  )
}

export default FormTitleItem
