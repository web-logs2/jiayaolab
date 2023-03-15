const { msg } = require('../../../util/msg')
const { User, Draft } = require('../../../app')

exports.main = async (req, res) => {
  const { uuid: draftId, title, tags, text, html, _private } = req.body
  const { email, password } = req.auth

  try {
    if (
      typeof title === 'string' &&
      Array.isArray(tags) &&
      typeof text === 'string' &&
      typeof html === 'string' &&
      typeof _private === 'boolean'
    ) {
      // 获取登录用户的id
      const { id: userId } = await User.findOne({ where: { email, password } })
      // 判断是否有传参过来的草稿id
      if (draftId) {
        // 如果有这个草稿id则更新
        const draft = await Draft.findOne({ where: { uuid: draftId } })
        if (draft) {
          await Draft.update(
            {
              title,
              tags: tags.join('|'),
              text,
              html,
              _private,
            },
            { where: { uuid: draftId } }
          )
          res.status(201).json(msg(201, { draftId }, '已保存！'))
        } else {
          res.status(400).json(msg(400, null, '该草稿已被删除！'))
        }
      } else {
        // 没有接收到传参过来的draftId，新建一个草稿
        const { uuid: draftId } = await Draft.create({
          title,
          tags: tags.join('|'),
          text,
          html,
          _private,
          userId,
        })
        res.status(201).json(msg(201, { draftId }, '已保存！'))
      }
    } else {
      res.status(400).json(msg(400, null, '参数无效！'))
    }
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
