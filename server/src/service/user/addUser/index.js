const { User } = require('../../../app')
const jwt = require('../../../util/jwt')

exports.main = async (req, res) => {
  const { email, password } = req.body

  try {
    // 请求必要参数
    if (email && password) {
      const hasRegistered = await User.findOne({
        where: { email },
      })

      if (hasRegistered) {
        res.status(400).json({
          code: 400,
          data: null,
          message: '该邮箱已存在！请更换邮箱并重试。',
        })
      } else {
        await User.create({
          email,
          password,
        })
        res.status(201).json({
          code: 201,
          data: {
            token: jwt.getToken(email, password),
          },
          message: '注册成功！',
        })
      }
    } else {
      res.status(400).json({ code: 400, data: null, message: '参数无效！' })
    }
  } catch (e) {
    res.status(400).json({ code: 400, data: null, message: '服务器错误！' })
  }
}
