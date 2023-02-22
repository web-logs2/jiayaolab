const { User } = require('../../../app')
const jwt = require('../../../util/jwt')

exports.main = async (req, res) => {
  const { email, password, type } = req.body

  try {
    // 请求必要参数
    if (email && password && type === 'login') {
      const user = await User.findOne({
        attributes: {
          exclude: ['password', 'id', 'createdAt'],
        },
        where: {
          email,
          password,
        },
      })
      if (user) {
        res.status(200).json({
          code: 200,
          data: {
            token: jwt.getToken(email, password),
          },
          message: '登录成功！',
        })
      } else {
        res.status(400).json({
          code: 400,
          data: null,
          message: '邮箱或密码错误！',
        })
      }
    } else {
      res.status(400).json({ code: 400, data: null, message: '参数无效！' })
    }
  } catch (e) {
    res.status(400).json({ code: 400, data: null, message: '服务器错误！' })
  }
}
