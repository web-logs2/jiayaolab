const { User } = require('../../../app')

// 此函数仅供验证，在express-jwt中间件处理错误异常
exports.main = async (req, res) => {
  const { email, password } = req.auth
  const { uuid } = await User.findOne({ where: { email, password } })
  res.status(200).json({
    code: 200,
    data: {
      userId: uuid,
    },
    message: 'ok',
  })
}
