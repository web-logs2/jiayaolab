const jsonwebtoken = require('jsonwebtoken')

const getToken = (email, password) =>
  jsonwebtoken.sign(
    {
      email,
      password,
    },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '7d',
    }
  )

module.exports.getToken = getToken
