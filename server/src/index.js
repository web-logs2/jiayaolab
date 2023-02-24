const { CloudBaseRunServer } = require('./server.js')
const { initDB } = require('./app')
const jwt = require('express-jwt').expressjwt

const port = 3000
const server = new CloudBaseRunServer().express

// 帖子
server.get('/post/get', require('./service/post/getPost').main)
server.get('/post/search', require('./service/post/searchPost').main)
server.post(
  '/post/add',
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
  }),
  require('./service/post/addPost').main
)

// 用户
server.post('/user/add', require('./service/user/addUser').main)
server.post('/user/session', require('./service/user/sessionUser').main)
server.post(
  '/user/session/verity',
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
  }),
  require('./service/user/verityUser').main
)

async function main() {
  await initDB()
  // 用户验证
  server.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(err.status).send({
        code: err.status,
        data: null,
        message: '登录已失效，请重新登录！',
      })
    } else {
      next(err)
    }
  })
  server.listen(port, () =>
    console.log(`Server ready at: http://localhost:${port}`)
  )
}

main()
