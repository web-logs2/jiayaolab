const { User, Draft } = require('../../../app')
const { msg } = require('../../../util/msg')

exports.main = async (req, res) => {
  const { draftId } = req.query
  const { email, password } = req.auth

  try {
    if (!draftId) {
      res.status(400).json(msg(400, null, '参数无效！'))
      return
    }

    const draft = await Draft.findOne({
      include: {
        model: User,
        attributes: ['uuid'],
      },
      where: { uuid: draftId },
    })
    if (!draft) {
      res.status(400).json(msg(400, null, '该草稿已被删除！'))
      return
    }

    const user = await User.findOne({ where: { email, password } })
    if (user.uuid !== draft.user.uuid) {
      res.status(400).json(msg(400, null, '登录用户与草稿所有者不匹配！'))
      return
    }

    await Draft.destroy({ where: { uuid: draftId } })
    res.status(200).json(msg(200, null, '草稿删除成功！'))
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
