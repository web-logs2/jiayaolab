const { Post, User } = require('../../../app')
const { msg } = require('../../../util/msg')

exports.main = async (req, res) => {
  const { title, tags, text, html, _private } = req.body
  const { email, password } = req.auth

  try {
    if (title && tags && text && html && typeof _private === 'boolean') {
      // 获取用户ID
      const { id: userId } = await User.findOne({
        where: { email, password },
      })
      // 创建帖子
      await Post.create({
        title,
        tags,
        text,
        html,
        _private,
        userId,
      })
      res.status(201).json(msg(201, null, '帖子发布成功！'))
    } else {
      res.status(400).json(msg(400, null, '参数无效！'))
    }
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
