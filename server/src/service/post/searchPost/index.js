const { Post, User } = require('../../../app')
const { Op } = require('sequelize')
const { msg } = require('../../../util/msg')

exports.main = async (req, res) => {
  const { current, sortField, sortOrder, keywords } = req.query

  try {
    if (current && sortField && sortOrder && (keywords || keywords === '')) {
      const limit = 5
      const { rows } = await Post.findAndCountAll({
        limit,
        attributes: ['uuid', 'createdAt', 'updatedAt', 'title', 'text'],
        include: {
          model: User,
          attributes: ['uuid', 'username', 'bio'],
        },
        offset: Number(current) * limit - limit,
        order: [[sortField, sortOrder.toUpperCase()]],
        // 在标题或正文当中包含指定的关键字就返回该帖子
        where: {
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
