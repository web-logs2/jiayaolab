const { Post, User } = require('../../../app')
const { msg } = require('../../../util/msg')

exports.main = async (req, res) => {
  const { id } = req.query

  try {
    // 判断是否是用户自身访问
    let isUserSelf = false
    const post = await Post.findOne({
      attributes: [
        '_private',
        'uuid',
        'createdAt',
        'updatedAt',
        'title',
        'tags',
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
        res.status(200).json(
          msg(
            200,
            {
              ...post.dataValues,
              tags: post.dataValues.tags
                ? post.dataValues.tags.split('|')
                : null,
            },
            'ok'
          )
        )
        // 判断该帖子是否仅自己可见
      } else if (post._private) {
        res.status(400).json(msg(400, null, '该帖子仅作者可见！'))
      } else {
        res.status(200).json(
          msg(
            200,
            {
              ...post.dataValues,
              tags: post.dataValues.tags ? post.dataValues.tags.split('|') : [],
            },
            'ok'
          )
        )
      }
    } else {
      res.status(400).json(msg(400, null, '该帖子不存在！'))
    }
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
