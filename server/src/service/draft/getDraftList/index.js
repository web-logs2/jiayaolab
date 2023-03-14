const { msg } = require('../../../util/msg')
const { User, Draft } = require('../../../app')
const { toArrayTags } = require('../../../util/toArrayTags')

exports.main = async (req, res) => {
  const { email, password } = req.auth

  try {
    const { id: userId } = await User.findOne({ where: { email, password } })
    const { rows } = await Draft.findAndCountAll({
      attributes: {
        exclude: ['id', 'userId'],
      },
      order: [['updatedAt', 'DESC']],
      where: {
        userId,
      },
    })
    res.status(200).json(
      msg(
        200,
        rows.map(row => ({
          ...row.dataValues,
          tags: toArrayTags(row.dataValues.tags),
        })),
        'ok'
      )
    )
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
