import { Form, Switch } from 'antd'
import { FC, useState } from 'react'

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
