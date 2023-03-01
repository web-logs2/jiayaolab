import dayjs from 'dayjs'

/**
 * 日期格式化
 * @param date 日期字符串或时间戳
 */
export const formatDate = (date?: number | string) =>
  dayjs(date).format('YYYY-MM-DD HH:mm')

/**
 * 获得与指定日期的相对时间
 * @param date 日期字符串或时间戳
 */
export const fromNowDate = (date?: number | string) =>
  dayjs(date).fromNow().replaceAll(' ', '')
