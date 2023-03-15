const { User } = require('../../../app')
const jwt = require('../../../util/jwt')
const { msg } = require('../../../util/msg')

exports.main = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email && !password) {
      res.status(400).json(msg(400, null, '参数无效！'))
      return
    }

    const hasRegistered = await User.findOne({ where: { email } })
    // 判断邮箱是否已经被注册
    if (hasRegistered) {
      res.status(400).json(msg(400, null, '该邮箱已存在！请更换邮箱并重试。'))
      return
    }

    // 用户注册
    const { uuid } = await User.create({
      email,
      password,
      // 默认用户名为邮箱的前缀
      username: email.split('@')[0].slice(0, 16),
    })
    res.status(201).json(
      msg(
        201,
        {
          token: jwt.getToken(email, password),
          userId: uuid,
        },
        '注册成功！'
      )
    )
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
