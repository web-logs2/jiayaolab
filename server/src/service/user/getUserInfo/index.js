const result = require('@/util/result')
const { User } = require('@/app')

exports.main = async (req, res) => {
  const { userId } = req.query

  try {
    if (!userId) {
      res.status(400).json(result(400, null, '参数无效！'))
      return
    }

    const user = await User.findOne({
      attributes: ['uuid', 'username', 'bio'],
      where: { uuid: userId },
    })
    // 判断是否存在该用户
    if (!user) {
      res.status(400).json(result(400, null, '用户不存在！'))
      return
    }

    res.status(200).json(result(200, user, 'ok'))
  } catch (e) {
    console.error(e)
    res.status(400).json(result(400, null, '服务器错误！'))
  }
}
