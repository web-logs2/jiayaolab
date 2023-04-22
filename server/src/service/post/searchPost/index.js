const { Post, User } = require('@/app')
const { Op } = require('sequelize')
const result = require('@/util/result')
const { toArray, slices } = require('@/util/string')

exports.main = async (req, res) => {
  const limit = 5
  const { current, sortField, sortOrder, keywords } = req.query

  try {
    // 判断参数是否符合规则
    if (!(current && sortField && sortOrder && (keywords || keywords === ''))) {
      res.status(400).json(result(400, null, '参数无效！'))
      return
    }

    // 获取帖子数据
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
      order: [[sortField, sortOrder.toUpperCase()]],
      // 在标题或正文当中包含指定的关键字就返回该帖子
      where: {
        _private: false,
        [Op.or]: [
          {
            title: {
              [Op.like]: ['', ...keywords.split(''), ''].join('%'),
            },
          },
          {
            text: {
              [Op.like]: ['', ...keywords.split(''), ''].join('%'),
            },
          },
        ],
      },
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
