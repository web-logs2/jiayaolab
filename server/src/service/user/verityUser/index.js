const { User } = require('../../../app')
const { msg } = require('../../../util/msg')

// 此函数仅供验证，在express-jwt中间件处理错误异常
exports.main = async (req, res) => {
  const { email, password } = req.auth

  try {
    const { uuid } = await User.findOne({ where: { email, password } })
    res.status(200).json(msg(200, { userId: uuid }, 'ok'))
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
