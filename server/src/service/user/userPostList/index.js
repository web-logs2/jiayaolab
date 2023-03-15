const { msg } = require('../../../util/msg')
const { Post, User } = require('../../../app')
const { toArrayTags } = require('../../../util/toArrayTags')
const { sliceText } = require('../../../util/sliceText')

exports.main = async (req, res) => {
  const limit = 5
  const { current, userId } = req.query

  try {
    if (!(userId && current)) {
      res.status(400).json(msg(400, null, '参数无效！'))
      return
    }

    const findUser = await User.findOne({ where: { uuid: userId } })
    // 判断是否存在该用户
    if (!findUser) {
      res.status(400).json(msg(400, null, '用户不存在！'))
      return
    }

    // 是否是当前登录用户访问自身用户信息页面
    let isUserSelf = false
    // 判断此次请求是否是登录用户请求的
    if (req.auth) {
      const { email, password } = req.auth
      const loginUser = await User.findOne({ where: { email, password } })
      // 如果登录用户信息和查看用户的id对应，则是用户访问自己的用户信息页面
      // 返回用户所有的帖子
      if (loginUser.uuid === findUser.uuid) {
        isUserSelf = true
      }
    }

    // 返回获取到的帖子
    const { rows } = await Post.findAndCountAll({
      limit,
      attributes: {
        exclude: ['html', 'id', 'userId'],
      },
      include: {
        model: User,
        attributes: ['uuid'],
      },
      offset: Number(current) * limit - limit,
      order: [['createdAt', 'DESC']],
      where: {
        userId: findUser.id,
        // 如果是用户自身访问，则无视帖子是否仅自己可见，返回全部内容
        ...(isUserSelf ? {} : { _private: false }),
      },
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
