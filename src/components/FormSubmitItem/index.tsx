import { Button, Form } from 'antd'
import { FC } from 'react'

/**
 * 发布帖子按钮
 * @param loading 是否加载中
 * @param text 按钮文字信息
 */
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
