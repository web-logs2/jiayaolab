import { Form, Switch } from 'antd'
import { FC, useState } from 'react'

/**
 * 帖子仅自己可见选择框
 * @param value 当前选中状态
 * @param setValue 修改选中状态的函数
 */
const FormPrivateItem: FC<{
  onChange: [boolean, (newValue: boolean) => void]
}> = ({ onChange: [value, setValue] }) => {
  const [checked, setChecked] = useState<boolean>(value)

  return (
    <Form.Item name="_private" label="仅自己可见" colon={false}>
      <Switch
        checked={checked}
        onChange={value => {
          setChecked(value)
          setValue(value)
        }}
      />
    </Form.Item>
  )
}

export default FormPrivateItem
