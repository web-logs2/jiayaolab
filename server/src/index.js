const { CloudBaseRunServer } = require('./server.js')
const { initDB } = require('./app')
const { msg } = require('./util/msg')
const { expressjwt } = require('express-jwt')
const { TokenExpiredError } = require('jsonwebtoken')

const port = 3000
const server = new CloudBaseRunServer().express
const jwtVerify = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
})

// 获得帖子
server.get('/post/recommend', require('./service/post/recommendPost').main)
// 获得帖子详情
server.get('/post/detail', require('./service/post/detailPost').main)
// 搜索帖子
server.get('/post/search', require('./service/post/searchPost').main)
// 发布帖子
server.post(
  '/post/submit',
  jwtVerify,
  require('./service/post/submitPost').main
)

// 用户注册
server.post('/user/add', require('./service/user/addUser').main)
// 用户登录
server.post('/user/session', require('./service/user/sessionUser').main)
// 用户验证
server.post(
  '/user/session/verify',
  jwtVerify,
  require('./service/user/verifyUser').main
)
// 获取用户信息
server.get('/user/info', require('./service/user/getUserInfo').main)
// 更新用户信息
server.post(
  '/user/update',
  jwtVerify,
  require('./service/user/updateUser').main
)
// 用户帖子列表
server.get('/user/post/list', require('./service/user/userPostList').main)

async function main() {
  // 初始化数据库
  await initDB()
  // token验证中间件
  server
    .use(function (err, req, res, next) {
      // err.inner可能抛出的错误类型
      // JsonWebTokenError = token格式错误
      // TokenExpiredError = token已过期
      if (err.name === 'UnauthorizedError') {
        res
          .status(err.status)
          .send(
            msg(
              err.status,
              null,
              err.inner instanceof TokenExpiredError
                ? '登录已过期，请重新登录！'
                : '请先登录！'
            )
          )
      } else {
        next(err)
      }
    })
    .listen(port, () =>
      console.log(`Server ready at: http://localhost:${port}`)
    )
}

main()
