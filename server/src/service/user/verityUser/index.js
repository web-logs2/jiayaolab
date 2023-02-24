exports.main = (req, res) => {
  // 验证成功，返回 200 状态码
  res.status(200).json({
    code: 200,
    data: null,
    message: 'ok',
  })
}
