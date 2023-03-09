const { msg } = require('../../../util/msg')
const { User, Post } = require('../../../app')

exports.main = async (req, res) => {
  const { postId } = req.query
  const { email, password } = req.auth

  try {
    if (postId) {
      const user = await User.findOne({ where: { email, password } })
      const post = await Post.findOne({ where: { uuid: postId } })

      if (user.id === post.userId) {
        await Post.destroy({ where: { uuid: postId } })
        res.status(200).json(msg(200, null, '帖子删除成功！'))
      } else {
        res.status(400).json(msg(400, null, '登录用户与帖子所有者不匹配！'))
      }
    } else {
      res.status(400).json(msg(400, null, '参数无效！'))
    }
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
