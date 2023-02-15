const { Post } = require('../../../app')
const { Op } = require('sequelize')

exports.main = async (req, res) => {
  // 单次查询最大数量
  const limit = 5
  const { current, sortField, sortOrder, keywords } = req.query

  try {
    if (current && sortField && sortOrder && (keywords || keywords === '')) {
      const { rows } = await Post.findAndCountAll({
        limit,
        offset: Number(current) * limit - limit,
        order: [[sortField, sortOrder.toUpperCase()]],
        // 在标题或正文当中包含指定的关键字就返回该帖子
        where: {
          publicly: true,
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
      res.status(200).json({ code: 200, data: rows, message: 'ok' })
    } else {
      res.status(400).json({ code: 400, data: null, message: '参数无效！' })
    }
  } catch (e) {
    res.status(400).json({ code: 400, data: null, message: '服务器错误！' })
  }
}
