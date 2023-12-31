const result = require('@/util/result')
const { User, Post } = require('@/app')

exports.main = async (req, res) => {
  const { postId } = req.query
  const { email, password } = req.auth

  try {
    if (!postId) {
      res.status(400).json(result(400, null, '参数无效！'))
      return
    }

    const post = await Post.findOne({
      include: {
        model: User,
        attributes: ['uuid'],
      },
      where: { uuid: postId },
    })
    // 判断帖子是否存在，如果不存在就代表已被删除
    if (!post) {
      res.status(400).json(result(400, null, '该帖子已被删除！'))
      return
    }

    // 获取用户信息
    const user = await User.findOne({ where: { email, password } })
    // 判断用户id是否和帖子所有者的id匹配
    if (user.uuid !== post.user.uuid) {
      res.status(400).json(result(400, null, '你不能删除其他用户的帖子！'))
      return
    }

    // 删除帖子
    await Post.destroy({ where: { uuid: postId } })
    res.status(200).json(result(200, null, '帖子删除成功！'))
  } catch (e) {
    console.error(e)
    res.status(400).json(result(400, null, '服务器错误！'))
  }
}
