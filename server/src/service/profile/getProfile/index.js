const { User } = require('../../../app')

exports.main = async (req, res) => {
  const { email, password } = req.auth
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
    message: 'ok',
  })
}
