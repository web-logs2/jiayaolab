/**
 * 返回服务器的响应结果
 * @param code HTTP 消息代码
 * @param data 返回的数据
 * @param message 返回执行结果
 * @return {{code, data, message}}
 */
const result = (code, data, message) => {
  return {
    code,
    data,
    message,
  }
}

module.exports = result
