const { msg } = require('../../../util/msg')
const { User, Draft } = require('../../../app')

exports.main = async (req, res) => {
  const { uuid: draftId, title, tags, text, html, _private } = req.body
  const { email, password } = req.auth

  try {
    // 判断参数是否符合规则
    if (
      !(
        typeof title === 'string' &&
        Array.isArray(tags) &&
        typeof text === 'string' &&
        typeof html === 'string' &&
        typeof _private === 'boolean'
      )
    ) {
      res.status(400).json(msg(400, null, '参数无效！'))
      return
    }

    // 判断是否有传参过来草稿id
    if (draftId) {
      const draft = await Draft.findOne({ where: { uuid: draftId } })
      if (!draft) {
        res.status(400).json(msg(400, null, '该草稿已被删除！'))
        return
      }

      // 如果有这个草稿id则更新该草稿
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
      // 没有接收到传参过来的draftId，新建一个草稿
      // 获取用户id
      const { id: userId } = await User.findOne({ where: { email, password } })
      // 创建一个草稿，返回该草稿的id
      const { uuid: draftId } = await Draft.create({
        title,
        tags: tags.join('|'),
        text,
        html,
        _private,
        userId,
      })
      // 返回草稿id，以便后续更新
      res.status(201).json(msg(201, { draftId }, '已保存！'))
    }
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
