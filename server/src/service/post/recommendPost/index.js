const { Post, User } = require('../../../app')
const { msg } = require('../../../util/msg')
const { toArrayTags } = require('../../../util/toArrayTags')
const { sliceText } = require('../../../util/sliceText')

exports.main = async (req, res) => {
  const { current, sortField } = req.query

  try {
    if (!current && !sortField) {
      res.status(400).json(msg(400, null, '参数无效！'))
      return
    }

    const limit = 5
    const { rows } = await Post.findAndCountAll({
      limit,
      attributes: {
        exclude: ['id', 'html', 'userId', '_private'],
      },
      include: {
        model: User,
        attributes: ['uuid', 'username'],
      },
      offset: Number(current) * limit - limit,
      order: [[sortField, 'DESC']],
      where: { _private: false },
    })
    res.status(200).json(
      msg(
        200,
        rows.map(row => ({
          ...row.dataValues,
          text: sliceText(row.dataValues.text),
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
