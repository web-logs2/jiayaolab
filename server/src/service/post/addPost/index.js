const { Post, User } = require('../../../app')

exports.main = async (req, res) => {
  const { title, text, html, publicly } = req.body
  const { email, password } = req.auth

  try {
    if (title && text && html && typeof publicly === 'boolean') {
      // 获取用户ID
      const { id: userId } = await User.findOne({
        where: { email, password },
      })
      // 创建帖子
      await Post.create({
        title,
        text,
        html,
        publicly,
        userId,
      })
      res.status(201).json({ code: 201, data: null, message: '帖子发布成功！' })
    } else {
      res.status(400).json({ code: 400, data: null, message: '参数无效！' })
    }
  } catch (e) {
    res.status(400).json({ code: 400, data: null, message: '服务器错误！' })
  }
}
