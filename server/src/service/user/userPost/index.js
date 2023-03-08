const { msg } = require('../../../util/msg')
const { Post, User } = require('../../../app')

exports.main = async (req, res) => {
  const limit = 5
  const { current, userId } = req.query

  try {
    if (userId && current) {
      const { id } = await User.findOne({ where: { uuid: userId } })
      const { rows } = await Post.findAndCountAll({
        limit,
        attributes: ['uuid', 'createdAt', 'updatedAt', 'title', 'text'],
        include: {
          model: User,
          attributes: ['uuid', 'username', 'bio'],
        },
        offset: Number(current) * limit - limit,
        order: [['createdAt', 'DESC']],
        where: {
          userId: id,
        },
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
