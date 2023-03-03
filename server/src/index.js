const { CloudBaseRunServer } = require('./server.js')
const { initDB } = require('./app')
const { TokenExpiredError } = require('jsonwebtoken')
const jwt = require('express-jwt').expressjwt

const port = 3000
const server = new CloudBaseRunServer().express

// 获得帖子
server.get('/post/get', require('./service/post/getPost').main)
// 搜索帖子
server.get('/post/search', require('./service/post/searchPost').main)
// 发布帖子
server.post(
  '/post/add',
  jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
  require('./service/post/addPost').main
)

// 注册用户
server.post('/user/add', require('./service/user/addUser').main)
// 登录用户
server.post('/user/session', require('./service/user/sessionUser').main)
// 验证用户
server.post(
  '/user/session/verity',
  jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
  require('./service/user/verityUser').main
)

async function main() {
  // 初始化数据库
  await initDB()
  // 用户TOKEN验证中间件
  server
    .use(function (err, req, res, next) {
      // err.inner = JsonWebTokenError（token错误） / TokenExpiredError（token过期错误）
      if (err.name === 'UnauthorizedError') {
        res.status(err.status).send({
          code: err.status,
          data: null,
          message:
            err.inner instanceof TokenExpiredError
              ? '登录已过期，请重新登录！'
              : '请先登录！',
        })
      } else {
        next(err)
      }
    })
    .listen(port, () =>
      console.log(`Server ready at: http://localhost:${port}`)
    )
}

main()
