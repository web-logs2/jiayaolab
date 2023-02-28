const { User } = require('../../../app')

exports.main = async (req, res) => {
  const { email, password } = req.auth
  const data = await User.findOne({
    attributes: ['uuid', 'email', 'username', 'bio'],
    where: { email, password },
  })
  res.status(200).json({ code: 200, data, message: 'ok' })
}
