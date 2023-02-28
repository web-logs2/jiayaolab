const { User } = require('../../../app')

exports.main = async (req, res) => {
  const { email, password } = req.auth
  const { username, bio } = req.body

  try {
    if (username) {
      // 更新资料
      await User.update(
        { username, bio },
        {
          where: { email, password },
        }
      )
      // 更新完成后返回最新的资料
      const updated = await User.findOne({
        attributes: ['uuid', 'email', 'username', 'bio'],
        where: { email, password },
      })
      res.status(200).json({
        code: 200,
        data: updated,
        message: '用户资料已更新！',
      })
    } else {
      res.status(400).json({ code: 400, data: null, message: '参数无效！' })
    }
  } catch (e) {
    res.status(400).json({ code: 400, data: null, message: '服务器错误！' })
  }
}
