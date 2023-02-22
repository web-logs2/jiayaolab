const { Post } = require('../../../app')

exports.main = async (req, res) => {
  // 单次查询最大数量
  const limit = 5
  const { id, type, current, sortField } = req.query

  try {
    // 帖子详情页面
    if (id && type === 'detail' && !current && !sortField) {
      const post = await Post.findOne({
        attributes: {
          exclude: ['text'],
        },
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
      // 主页推荐页面
    } else if (!id && type === 'category' && current && sortField) {
      const { rows } = await Post.findAndCountAll({
        limit,
        attributes: {
          exclude: ['html'],
        },
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
