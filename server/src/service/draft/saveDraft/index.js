const { msg } = require('../../../util/msg')
const { User, Draft } = require('../../../app')

exports.main = async (req, res) => {
  const { draftId, title, tags, text, html, _private } = req.body
  const { email, password } = req.auth
  const createDraft = async () => {
    // 获取登录用户的id
    const { id: userId } = await User.findOne({ where: { email, password } })
    // 创建一个草稿，创建成功后返回该草稿的id
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

    // 判断标签草稿数量是否符合规则
    if (tags.length > 16) {
      res.status(400).json(msg(400, null, '标签草稿最多保存16个！'))
      return
    }

    // 判断标签草稿长度是否符合规则
    if (tags.filter(tag => tag.length > 20).length) {
      res.status(400).json(msg(400, null, '标签草稿单个长度不能大于20个字符！'))
      return
    }

    // 判断是否接收到草稿id
    if (!draftId) {
      // 草稿id不存在，创建一个
      await createDraft()
      return
    }

    // 判断数据库中是否存在该草稿
    const findDraft = await Draft.findOne({ where: { uuid: draftId } })
    if (!findDraft) {
      // 草稿不存在，创建一个
      await createDraft()
      return
    }

    // 有草稿id，更新这个草稿的内容
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
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
