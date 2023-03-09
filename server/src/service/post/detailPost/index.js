const { Post, User } = require('../../../app')
const { msg } = require('../../../util/msg')

exports.main = async (req, res) => {
  const { id } = req.query

  try {
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
    if (post) {
      if (post._public) {
        res.status(200).json(msg(200, post, 'ok'))
      } else {
        res.status(400).json(msg(400, null, '该帖子关闭了公开访问！'))
      }
    } else {
      res.status(400).json(msg(400, null, '该帖子不存在！'))
    }
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
