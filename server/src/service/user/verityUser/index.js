// 此函数仅供验证，在express-jwt中间件处理错误异常
exports.main = (req, res) => {
  res.status(200).json({ code: 200, data: null, message: 'ok' })
}
