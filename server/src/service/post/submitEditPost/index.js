const { msg } = require('../../../util/msg')
const { User, Post } = require('../../../app')

exports.main = async (req, res) => {
  const { email, password } = req.auth
  const { postId, title, tags, text, html, _private } = req.body

  try {
    if (
      // 判断参数是否符合规则
      !(
        typeof postId === 'string' &&
        typeof title === 'string' &&
        Array.isArray(tags) &&
        tags.length &&
        typeof text === 'string' &&
        typeof html === 'string' &&
        typeof _private === 'boolean'
      )
    ) {
      res.status(400).json(msg(400, null, '参数无效！'))
      return
    }

    if (tags.join('').includes('|')) {
      res.status(400).json(msg(400, null, '帖子标签内含有非法字符！'))
      return
    }

    // 根据id获取帖子
    const post = await Post.findOne({
      include: {
        model: User,
        attributes: ['uuid'],
      },
      where: { uuid: postId },
    })
    // 判断该帖子是否存在
    if (!post) {
      res.status(400).json(msg(400, null, '帖子不存在！'))
      return
    }

    // 获取用户id
    const user = await User.findOne({ where: { email, password } })
    // 判断用户id是否和帖子所有者的id匹配
    if (user.uuid !== post.user.uuid) {
      res.status(400).json(msg(400, null, '你不能编辑其他用户的帖子！'))
      return
    }

    if (title.length > 30) {
      res.status(400).json(msg(400, null, '帖子标题不能大于30个字符！'))
      return
    }

    if (tags.length > 8) {
      res.status(400).json(msg(400, null, '最多填写8个帖子标签！'))
      return
    }

    if (tags.filter(tag => tag.length > 10).length) {
      res.status(400).json(msg(400, null, '标签单个长度不能大于10个字符！'))
      return
    }

    if (text.length > 30000) {
      res.status(400).json(msg(400, null, '帖子内容不能大于30000个字符！'))
      return
    }

    // 更新指定帖子
    await Post.update(
      {
        title,
        tags: tags.join('|'),
        text,
        html,
        _private,
      },
      { where: { uuid: postId } }
    )
    res.status(200).json(msg(200, null, '帖子已更新！'))
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
