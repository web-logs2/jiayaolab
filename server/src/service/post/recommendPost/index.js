const { Post, User } = require('@/app')
const result = require('@/util/result')
const { slices, toArray } = require('@/util/string')

exports.main = async (req, res) => {
  const { current, sortField } = req.query

  try {
    // 判断参数是否存在
    if (!(current && sortField)) {
      res.status(400).json(result(400, null, '参数无效！'))
      return
    }

    // 一次最多查询的数量
    const limit = 5
    // 获取数据
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
      result(
        200,
        rows.map(row => ({
          ...row.dataValues,
          text: slices(row.dataValues.text),
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
