const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const result = require('./util/result')
const SHA256 = require('crypto-js/sha256')
const { TokenExpiredError } = require('jsonwebtoken')

// 服务器日志
const logger = morgan('combined')

class Server {
  constructor() {
    this.express = express()
    this.express.use(
      express.json({
        // number类型的默认单位是bytes
        // 字符串需要带上数据单位
        limit: '500kb',
      })
    )
    this.express.use(
      express.urlencoded({
        extended: true,
        limit: '500kb',
      })
    )
    this.express.use(cors())
    this.express.use(logger)
    // 用于判断邮箱格式是否正确的中间件
    this.express.use((req, res, next) => {
      if (req.body.email) {
        if (
          !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
            req.body.email
          )
        ) {
          res.status(400).json(result(400, null, '邮箱格式不正确！'))
          return
        }

        if (req.body.email.length > 50) {
          res.status(400).json(result(400, null, '邮箱长度不得大于50个字符！'))
          return
        }
      }
      next()
    })
    // 用于判断和加密用户密码的中间件
    this.express.use((req, res, next) => {
      if (req.body.password) {
        if (req.body.password.length < 8) {
          res.status(400).json(result(400, null, '密码长度不得少于8个字符！'))
          return
        }

        if (req.body.password.length > 32) {
          res.status(400).json(result(400, null, '密码长度不得大于32个字符！'))
          return
        }

        req.body.password = SHA256(req.body.password).toString()
      }
      next()
    })
  }

  start(port) {
    // 用于验证token的中间件
    this.express.use((err, _req, res, next) => {
      if (err.name === 'UnauthorizedError') {
        // err.inner可能抛出的错误类型
        // JsonWebTokenError = token格式错误
        // TokenExpiredError = token已过期
        const errorMsg =
          err.inner instanceof TokenExpiredError
            ? '登录已过期，请重新登录！'
            : '请先登录！'
        res.status(err.status).send(result(err.status, null, errorMsg))
      } else {
        next(err)
      }
    })
    // 用于无效请求的中间件
    this.express.use((_req, res) => {
      res.status(404).send(null)
    })
    // 开启服务
    this.express.listen(port, () =>
      console.log(`Server ready at: http://localhost:${port}`)
    )
  }
}

module.exports = Server
