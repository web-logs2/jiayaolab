const { User } = require('@/app')
const result = require('@/util/result')

// 此函数仅供验证，在express-jwt中间件处理错误异常
exports.main = async (req, res) => {
  const { email, password } = req.auth

  try {
    const { uuid } = await User.findOne({ where: { email, password } })
    res.status(200).json(result(200, { userId: uuid }, 'ok'))
  } catch (e) {
    console.error(e)
    res.status(400).json(result(400, null, '服务器错误！'))
  }
}
