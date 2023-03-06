const { msg } = require('../../../util/msg')
const { User } = require('../../../app')

exports.main = async (req, res) => {
  const { email, password } = req.auth
  const { username, bio } = req.body

  try {
    if (username) {
      // 更新用户信息
      await User.update({ username, bio }, { where: { email, password } })
      // 获取更新完成后的用户信息
      const data = await User.findOne({
        attributes: ['uuid', 'username', 'bio'],
        where: { email, password },
      })
      res.status(200).json(msg(200, data, '已更新！'))
    } else {
      res.status(400).json(msg(400, null, '参数无效！'))
    }
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
