const { msg } = require('../../../util/msg')
const { User } = require('../../../app')

exports.main = async (req, res) => {
  const { userId } = req.query

  try {
    if (!userId) {
      res.status(400).json(msg(400, null, '参数无效！'))
      return
    }

    const user = await User.findOne({
      attributes: ['uuid', 'username', 'bio'],
      where: { uuid: userId },
    })
    if (!user) {
      res.status(400).json(msg(400, null, '用户不存在！'))
      return
    }

    res.status(200).json(msg(200, user, 'ok'))
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
