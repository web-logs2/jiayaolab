const { msg } = require('../../../util/msg')
const { Post, User } = require('../../../app')

exports.main = async (req, res) => {
  const limit = 5
  const { current, userId } = req.query

  try {
    if (userId && current) {
      // 判断是否是登录用户访问自身用户信息页面
      let isUserSelf = false
      const findUser = await User.findOne({ where: { uuid: userId } })

      if (findUser) {
        // 判断是否有用户登录信息，没有就是未登录的用户
        if (req.auth) {
          const { email, password } = req.auth
          const loginUser = await User.findOne({ where: { email, password } })
          // 如果登录用户信息和查看用户的id对应，则是用户访问自己的用户信息页面
          // 返回用户所有的帖子
          if (loginUser.uuid === findUser.uuid) {
            isUserSelf = true
          }
        }
        const { rows } = await Post.findAndCountAll({
          limit,
          attributes: [
            'uuid',
            'createdAt',
            'updatedAt',
            'title',
            'tags',
            'text',
            '_private',
          ],
          include: {
            model: User,
            attributes: ['uuid'],
          },
          offset: Number(current) * limit - limit,
          order: [['createdAt', 'DESC']],
          where: {
            userId: findUser.id,
            ...(isUserSelf ? {} : { _private: false }),
          },
        })
        res.status(200).json(
          msg(
            200,
            rows.map(row => ({
              ...row.dataValues,
              text: row.dataValues.text
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 256),
              tags: row.dataValues.tags ? row.dataValues.tags.split('|') : [],
            })),
            'ok'
          )
        )
      } else {
        res.status(400).json(msg(400, null, '用户不存在！'))
      }
    } else {
      res.status(400).json(msg(400, null, '参数无效！'))
    }
  } catch (e) {
    console.error(e)
    res.status(400).json(msg(400, null, '服务器错误！'))
  }
}
