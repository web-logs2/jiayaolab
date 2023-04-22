const result = require('@/util/result')
const { User, Draft } = require('@/app')
const { toArray } = require('@/util/string')

exports.main = async (req, res) => {
  const { email, password } = req.auth

  try {
    // 获取用户id
    const { id: userId } = await User.findOne({ where: { email, password } })
    // 查找用户的所有草稿
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
      result(
        200,
        rows.map(row => ({
          ...row.dataValues,
          tags: toArray(row.dataValues.tags),
        })),
        'ok'
      )
    )
  } catch (e) {
    console.error(e)
    res.status(400).json(result(400, null, '服务器错误！'))
  }
}
