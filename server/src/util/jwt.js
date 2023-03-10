const jsonwebtoken = require('jsonwebtoken')
const { expressjwt } = require('express-jwt')

/**
 * 生成token
 * @param email token内保存的用户邮箱
 * @param password token内保存的加密过的用户密码
 * @return string 用户token
 */
const getToken = (email, password) =>
  jsonwebtoken.sign({ email, password }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d',
    audience: 'forum-app',
    issuer: 'expressjs',
  })

/**
 * 使用express-jwt中间件验证用户token是否有效
 * @param credentialsRequired 默认启用，当接收到的请求没有token时，返回验证失败，取消接下来的操作
 */
const useVerify = credentialsRequired =>
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired,
  })

module.exports = { getToken, useVerify }
