const { msg } = require('../../../util/msg')
const { User } = require('../../../app')

exports.main = async (req, res) => {
  const { userId } = req.query

  try {
    if (userId) {
      const user = await User.findOne({
        attributes: ['uuid', 'username', 'bio'],
        where: { uuid: userId },
      })
      if (user) {
        res.status(200).json(msg(200, user, 'ok'))
      } else {
        res.status(400).json(msg(400, null, '用户不存在！'))
      }
    } else {
      res.status(400).json(msg(400, null, '参数无效！'))
    }
  } catch (e) {
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
