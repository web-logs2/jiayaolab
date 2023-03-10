const { Post, User } = require('../../../app')
const { Op } = require('sequelize')
const { msg } = require('../../../util/msg')

exports.main = async (req, res) => {
  const limit = 5
  const { current, sortField, sortOrder, keywords } = req.query

  try {
    if (current && sortField && sortOrder && (keywords || keywords === '')) {
      const { rows } = await Post.findAndCountAll({
        limit,
        attributes: ['uuid', 'createdAt', 'updatedAt', 'title', 'tags', 'text'],
        include: {
          model: User,
          attributes: ['uuid', 'username', 'bio'],
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
        msg(
          200,
          rows.map(row => ({
            ...row.dataValues,
            text: row.dataValues.text.replace(/\s+/g, ' ').trim().slice(0, 256),
            tags: row.dataValues.tags ? row.dataValues.tags.split('|') : [],
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
