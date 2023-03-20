import { Empty, Form, Select } from 'antd'
import { FC } from 'react'

const FormTagItem: FC<{ onChange?: (value: any) => void }> = ({ onChange }) => {
  return (
    <Form.Item
      label="标签"
      colon={false}
      name="tags"
      rules={[
        { required: true, message: '请填写帖子标签' },
        () => ({
          validator(_ruleObject, values) {
            if (values.length > 8) {
              return Promise.reject('最多填写8个帖子标签')
            }
            return Promise.resolve()
          },
        }),
        () => ({
          validator(_ruleObject, values) {
            if (values.filter((v: string) => v.length > 10).length) {
              return Promise.reject('标签单个长度不能大于10个字符')
            }
            return Promise.resolve()
          },
        }),
      ]}
    >
      <Select
        placeholder="标签（必填）"
        notFoundContent={<Empty description={false} />}
        maxTagTextLength={10}
        mode="tags"
        onChange={onChange}
        tokenSeparators={[',', '|', ' ', '，']}
      />
    </Form.Item>
  )
}

export default FormTagItem
