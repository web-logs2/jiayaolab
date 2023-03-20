import { Button, Form } from 'antd'
import { FC } from 'react'
import classes from './index.module.less'

const FormUserSubmitItem: FC<{ loading: boolean; text: string }> = ({
  loading,
  text,
}) => {
  return (
    <Form.Item className={classes.submit}>
      <Button htmlType="submit" type="primary" loading={loading}>
        {text}
      </Button>
    </Form.Item>
  )
}

export default FormUserSubmitItem
