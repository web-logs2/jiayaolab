const result = require('@/util/result')
const { User } = require('@/app')

exports.main = async (req, res) => {
  const { email, password } = req.auth
  const { userId, username, bio } = req.body

  try {
    if (!(userId && username)) {
      res.status(400).json(result(400, null, '参数无效！'))
      return
    }

    // 判断需要更新信息的用户是否存在
    const targetUser = await User.findOne({ where: { uuid: userId } })
    if (!targetUser) {
      res.status(400).json(result(400, null, '用户不存在！'))
      return
    }

    // 获取更新的用户信息
    const user = await User.findOne({ where: { email, password } })
    // 判断更新的用户信息是否和当前登录用户的信息匹配
    if (user.uuid !== userId) {
      res.status(400).json(result(400, null, '你不能更改其他用户的个人资料！'))
      return
    }

    // 更新用户信息
    await User.update({ username, bio }, { where: { email, password } })
    // 获取更新完成后的用户信息
    const data = await User.findOne({
      attributes: ['uuid', 'username', 'bio'],
      where: { email, password },
    })
    res.status(200).json(result(200, data, '用户资料已更新！'))
  } catch (e) {
    console.error(e)
    res.status(400).json(result(400, null, '服务器错误！'))
  }
}
