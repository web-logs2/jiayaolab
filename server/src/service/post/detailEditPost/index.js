const { Post, User } = require('@/app')
const result = require('@/util/result')
const { toArray } = require('@/util/string')

exports.main = async (req, res) => {
  const { email, password } = req.auth
  const { postId } = req.query

  try {
    if (!postId) {
      res.status(400).json(result(400, null, '参数无效！'))
      return
    }

    // 根据帖子id获取帖子内容
    const post = await Post.findOne({
      attributes: {
        exclude: ['userId', 'id', 'createdAt', 'updatedAt'],
      },
      include: {
        model: User,
        attributes: ['uuid'],
      },
      where: { uuid: postId },
    })
    // 判断是否获取到帖子
    if (!post) {
      res.status(400).json(result(400, null, '该帖子不存在！'))
      return
    }

    const user = await User.findOne({ where: { email, password } })
    // 判断用户id是否和帖子所有者的id匹配
    if (user.uuid !== post.user.uuid) {
      res.status(400).json(result(400, null, '该帖子仅作者可编辑！'))
      return
    }

    // 返回帖子内容
    res
      .status(200)
      .json(
        result(
          200,
          { ...post.dataValues, tags: toArray(post.dataValues.tags) },
          'ok'
        )
      )
  } catch (e) {
    console.error(e)
    res.status(400).json(result(400, null, '服务器错误！'))
  }
}
