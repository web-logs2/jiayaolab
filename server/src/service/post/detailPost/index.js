const { Post, User } = require('../../../app')
const { msg } = require('../../../util/msg')
const { toArrayTags } = require('../../../util/toArrayTags')

exports.main = async (req, res) => {
  const { postId } = req.query

  try {
    // 判断是否是用户自身访问
    let isUserSelf = false
    if (!postId) {
      res.status(400).json(msg(400, null, '参数无效！'))
      return
    }

    // 根据帖子id获取帖子内容
    const post = await Post.findOne({
      attributes: {
        exclude: ['userId', 'id', 'text'],
      },
      include: {
        model: User,
        attributes: ['uuid', 'username', 'bio'],
      },
      where: { uuid: postId },
    })
    // 判断是否获取到帖子
    if (!post) {
      res.status(400).json(msg(400, null, '该帖子不存在！'))
      return
    }

    // 判断用户是否已经登录
    if (req.auth) {
      const { email, password } = req.auth
      const user = await User.findOne({ where: { email, password } })
      // 判断用户的id是否和帖子的所有者id相同，如果相同代表是帖子所有者自身访问
      if (user.uuid === post.user.uuid) {
        isUserSelf = true
      }
    }

    // 如果 不是用户自身访问 并且 帖子开启了仅自己可见，返回指定的错误消息
    if (!isUserSelf && post._private) {
      res.status(400).json(msg(400, null, '该帖子仅作者可见！'))
      return
    }

    // 返回帖子内容
    res
      .status(200)
      .json(
        msg(
          200,
          { ...post.dataValues, tags: toArrayTags(post.dataValues.tags) },
          'ok'
        )
      )
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
