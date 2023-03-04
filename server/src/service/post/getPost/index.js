const { Post, User } = require('../../../app')
const { msg } = require('../../../util/msg')

exports.main = async (req, res) => {
  const { id, type, current, sortField } = req.query

  try {
    // 帖子详情页面
    if (id && type === 'detail' && !current && !sortField) {
      const post = await Post.findOne({
        attributes: [
          'uuid',
          'createdAt',
          'updatedAt',
          'title',
          'html',
          'publicly',
        ],
        include: {
          model: User,
          attributes: ['uuid', 'username', 'bio'],
        },
        where: { uuid: id },
      })
      if (post) {
        if (post.publicly) {
          res.status(200).json(msg(200, post, 'ok'))
        } else {
          res.status(400).json(msg(400, null, '该帖子关闭了公开访问！'))
        }
      } else {
        res.status(400).json(msg(400, null, '该帖子不存在！'))
      }
      // 主页 推荐/最多收藏/最多浏览 页面
    } else if (!id && type === 'category' && current && sortField) {
      const limit = 5
      const { rows } = await Post.findAndCountAll({
        limit,
        attributes: ['uuid', 'createdAt', 'updatedAt', 'title', 'text'],
        include: {
          model: User,
          attributes: ['uuid', 'username', 'bio'],
        },
        offset: Number(current) * limit - limit,
        order: [[sortField, 'DESC']],
        where: {
          publicly: true,
        },
      })
      res.status(200).json(msg(200, rows, 'ok'))
    } else {
      res.status(400).json(msg(400, null, '参数无效！'))
    }
  } catch (e) {
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
