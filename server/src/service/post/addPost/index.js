const { Post } = require('../../../app')
exports.main = async (req, res) => {
  const { title, text, html, publicly } = req.body

  try {
    // 请求必要参数
    if (!(title && text && html && typeof publicly === 'boolean')) {
      res.status(400).json({ code: 400, data: null, message: '参数无效！' })
    } else {
      await Post.create({
        title,
        text,
        html,
        publicly,
      })
      res.status(201).json({ code: 201, data: null, message: '帖子发布成功！' })
    }
  } catch (e) {
    res.status(400).json({ code: 400, data: null, message: '服务器错误！' })
  }
}
