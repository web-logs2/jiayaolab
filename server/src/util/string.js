/**
 * 裁切文本
 * @param text 文本内容
 * @param length 裁剪长度，默认256个字符
 * @return {string}
 */
const slices = (text, length = 256) => {
  return text.replace(/\s+/g, ' ').trim().slice(0, length)
}

/**
 * 将字符串根据分隔符转换为数组
 * @param tags 字符串类型的数组
 * @param separator 分隔符，默认为 |
 * @return {*|*[]}
 */
const toArray = (tags, separator = '|') => {
  return tags ? tags.split(separator) : []
}

module.exports = { slices, toArray }
