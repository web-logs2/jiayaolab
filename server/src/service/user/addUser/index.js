const { User } = require('../../../app')
const jsonwebtoken = require('jsonwebtoken')

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
        const token = jsonwebtoken.sign(
          {
            email,
            password,
          },
          process.env.JWT_SECRET,
          {
            algorithm: 'HS256',
            expiresIn: '7d',
          }
        )
        res.status(201).json({
          code: 201,
          data: {
            token,
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
