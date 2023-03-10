const { Post, User } = require('../../../app')
const { msg } = require('../../../util/msg')

exports.main = async (req, res) => {
  const { id } = req.query

  try {
    // 判断是否是用户自身访问
    let isUserSelf = false
    const post = await Post.findOne({
      attributes: [
        '_public',
        'uuid',
        'createdAt',
        'updatedAt',
        'title',
        'html',
      ],
      include: {
        model: User,
        attributes: ['uuid', 'username', 'bio'],
      },
      where: { uuid: id },
    })

    // 获取到了指定的帖子
    if (post) {
      // 判断用户是否已经登录
      if (req.auth) {
        const { email, password } = req.auth
        const user = await User.findOne({ where: { email, password } })
        // 判断用户的id是否和帖子的所有者id相同，如果相同代表是帖子所有者自身访问
        if (user.uuid === post.user.uuid) {
          isUserSelf = true
        }
      }
      // 帖子的所有者访问，返回帖子的内容
      if (isUserSelf) {
        res.status(200).json(msg(200, post, 'ok'))
        // 判断是否是一个公开访问的帖子
      } else if (post._public) {
        res.status(200).json(msg(200, post, 'ok'))
      } else {
        // 关闭了公开访问，返回空数据
        res.status(400).json(msg(400, null, '该帖子仅作者可见！'))
      }
    } else {
      res.status(400).json(msg(400, null, '该帖子不存在！'))
    }
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
