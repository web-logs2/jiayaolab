const { User } = require('../../../app')
const jwt = require('../../../util/jwt')
const { msg } = require('../../../util/msg')

exports.main = async (req, res) => {
  const { email, password } = req.body

  try {
    if (email && password) {
      // 判断邮箱密码是否与数据库中的字段匹配
      const user = await User.findOne({
        where: { email, password },
      })
      if (user) {
        res.status(200).json(
          msg(
            200,
            {
              token: jwt.getToken(email, password),
              userId: user.uuid,
            },
            '登录成功！'
          )
        )
      } else {
        res.status(400).json(
          msg(
            400,
            {
              token: jwt.getToken(email, password),
              userId: user.uuid,
            },
            '邮箱或密码错误！'
          )
        )
      }
    } else {
      res.status(400).json(msg(400, null, '参数无效！'))
    }
  } catch (e) {
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
