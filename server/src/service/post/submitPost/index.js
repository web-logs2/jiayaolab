const { Post, User, Draft } = require('@/app')
const result = require('@/util/result')

exports.main = async (req, res) => {
  const { title, tags, text, html, _private, draftId } = req.body
  const { email, password } = req.auth

  try {
    // 判断参数是否符合规则
    if (
      !(
        typeof title === 'string' &&
        Array.isArray(tags) &&
        tags.length &&
        typeof text === 'string' &&
        typeof html === 'string' &&
        typeof _private === 'boolean'
      )
    ) {
      res.status(400).json(result(400, null, '参数无效！'))
      return
    }

    if (tags.join('').includes('|')) {
      res.status(400).json(result(400, null, '帖子标签内含有非法字符！'))
      return
    }

    if (title.length > 30) {
      res.status(400).json(result(400, null, '帖子标题不能大于30个字符！'))
      return
    }

    if (tags.length > 8) {
      res.status(400).json(result(400, null, '最多填写8个帖子标签！'))
      return
    }

    if (tags.filter(tag => tag.length > 10).length) {
      res.status(400).json(result(400, null, '标签单个长度不能大于10个字符！'))
      return
    }

    if (text.length > 30000) {
      res.status(400).json(result(400, null, '帖子内容不能大于30000个字符！'))
      return
    }

    // 获取用户id
    const { id: userId } = await User.findOne({ where: { email, password } })
    // 创建帖子
    await Post.create({
      title: title.trim(),
      tags: tags.join('|'),
      text,
      html,
      _private,
      userId,
    })
    // 如果有携带了草稿id，则删除这个草稿
    if (draftId) {
      await Draft.destroy({ where: { uuid: draftId } })
    }
    res.status(201).json(result(201, null, '帖子发布成功！'))
  } catch (e) {
    console.error(e)
    res.status(400).json(result(400, null, '服务器错误！'))
  }
}
