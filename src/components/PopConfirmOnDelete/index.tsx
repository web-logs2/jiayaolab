import { DeleteOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import { FC, ReactNode } from 'react'

/**
 * 需要二次确认的删除按钮
 * @param description 描述
 * @param onConfirm 确认后回调函数
 */
const PopConfirmOnDelete: FC<{
  description?: ReactNode
  onConfirm: () => void
}> = ({ description, onConfirm }) => {
  return (
    <Popconfirm
      title="二次确认"
      description={description}
      onConfirm={onConfirm}
      okText="是"
      cancelText="否"
    >
      <Button danger type="text" size="small" icon={<DeleteOutlined />}>
        删除
      </Button>
    </Popconfirm>
  )
}

export default PopConfirmOnDelete
