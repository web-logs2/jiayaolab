const { User } = require('../../../app')

exports.main = async (req, res) => {
  const { email, password } = req.auth
  const { username, bio } = req.body
  try {
    // 更新资料
    await User.update(
      {
        username,
        bio,
      },
      {
        where: {
          email,
          password,
        },
      }
    )
    // 更新完成后返回更新后的资料
    const profile = await User.findOne({
      attributes: {
        exclude: ['id', 'createdAt', 'password'],
      },
      where: {
        email,
        password,
      },
    })
    res.status(200).json({
      code: 200,
      data: profile,
      message: '用户资料已更新！',
    })
  } catch (e) {
    res.status(400).json({
      code: 400,
      data: null,
      message: '处理时发生错误！',
    })
  }
}
