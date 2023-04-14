import { Button, Form } from 'antd'
import { FC } from 'react'
import classes from './index.module.less'

/**
 * 用户登录和注册提交按钮
 * @param loading 是否加载中
 * @param text 按钮文字信息
 */
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
