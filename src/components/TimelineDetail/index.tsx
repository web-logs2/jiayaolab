import { Tooltip, Typography } from 'antd'
import { TooltipPlacement } from 'antd/es/tooltip'
import { FC } from 'react'
import { formatDate, fromNowDate } from '../../utils/format'

const { Text } = Typography
/**
 * 日期时间概览组件
 * @param date 需要转化的日期时间
 * @param placement 详细日期时间弹出位置
 */
const TimelineDetail: FC<{
  date?: string | number
  placement?: TooltipPlacement
}> = ({ date, placement }) => {
  return (
    <Tooltip title={formatDate(date)} placement={placement}>
      <Text type="secondary">{fromNowDate(date)}</Text>
    </Tooltip>
  )
}

export default TimelineDetail
