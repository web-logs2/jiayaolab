const { User } = require('@/app')
const jwt = require('@/util/jwt')
const result = require('@/util/result')

exports.main = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!(email && password)) {
      res.status(400).json(result(400, null, '参数无效！'))
      return
    }

    // 判断邮箱密码是否与数据库中的字段匹配
    const user = await User.findOne({
      where: { email, password },
    })
    // 用户不存在，邮箱或密码错误
    if (!user) {
      res.status(400).json(result(400, null, '邮箱或密码错误！'))
      return
    }

    res.status(200).json(
      result(
        200,
        {
          token: jwt.getToken(email, password),
          userId: user.uuid,
        },
        '登录成功！'
      )
    )
  } catch (e) {
    console.error(e)
    res.status(400).json(result(400, null, '服务器错误！'))
  }
}
