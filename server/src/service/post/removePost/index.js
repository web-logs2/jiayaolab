const { msg } = require('../../../util/msg')
const { User, Post } = require('../../../app')

exports.main = async (req, res) => {
  const { postId } = req.query
  const { email, password } = req.auth

  try {
    if (!postId) {
      res.status(400).json(msg(400, null, '参数无效！'))
      return
    }

    const post = await Post.findOne({
      include: {
        model: User,
        attributes: ['uuid'],
      },
      where: { uuid: postId },
    })
    if (!post) {
      res.status(400).json(msg(400, null, '该帖子已被删除！'))
      return
    }

    const user = await User.findOne({ where: { email, password } })
    if (user.uuid !== post.user.uuid) {
      res.status(400).json(msg(400, null, '登录用户与帖子所有者不匹配！'))
      return
    }

    await Post.destroy({ where: { uuid: postId } })
    res.status(200).json(msg(200, null, '帖子删除成功！'))
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
