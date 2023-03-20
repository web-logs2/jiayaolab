import { Button, Form } from 'antd'
import { FC } from 'react'

const FormSubmitItem: FC<{ loading: boolean; text: string }> = ({
  loading,
  text,
}) => {
  return (
    <Form.Item style={{ textAlign: 'center' }}>
      <Button
        style={{ paddingInline: 24 }}
        size="large"
        type="primary"
        htmlType="submit"
        loading={loading}
      >
        {text}
      </Button>
    </Form.Item>
  )
}

export default FormSubmitItem
