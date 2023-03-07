import dayjs from 'dayjs'

/**
 * 日期时间格式化
 * @param date 日期字符串或时间戳
 * @param template 日期格式化模板
 */
export const formatDate = (date?: number | string, template?: string) => {
  return dayjs(date).format(template || 'YYYY-MM-DD HH:mm')
}

/**
 * 获得与指定日期时间的相对时间
 * @param date 日期字符串或时间戳
 */
export const fromNowDate = (date?: number | string) =>
  dayjs(date).fromNow().replaceAll(' ', '')
