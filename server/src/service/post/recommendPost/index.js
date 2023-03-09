const { Post, User } = require('../../../app')
const { msg } = require('../../../util/msg')

exports.main = async (req, res) => {
  const { current, sortField } = req.query

  try {
    if (current && sortField) {
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
        where: { _public: true },
      })
      res.status(200).json(
        msg(
          200,
          rows.map(row => ({
            ...row.dataValues,
            text: row.dataValues.text.replace(/\s+/g, ' ').trim().slice(0, 256),
          })),
          'ok'
        )
      )
    } else {
      res.status(400).json(msg(400, null, '参数无效！'))
    }
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
