const { Post } = require('../../../app')

exports.main = async (req, res) => {
  // 单次查询最大数量
  const limit = 5
  const { id, current, sortField } = req.query

  try {
    if (id && !current && !sortField) {
      const post = await Post.findOne({
        where: {
          uuid: id,
          publicly: true,
        },
      })
      res.status(post ? 200 : 400).json({
        code: post ? 200 : 400,
        data: post,
        message: post ? 'ok' : '该帖子不存在或关闭了公开访问！',
      })
    } else if (!id && current && sortField) {
      const { rows } = await Post.findAndCountAll({
        limit,
        offset: Number(current) * limit - limit,
        order: [[sortField, 'DESC']],
        where: {
          publicly: true,
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
