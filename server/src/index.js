const { CloudBaseRunServer } = require('./server.js')
const { initDB } = require('./app')

const port = 3000
const server = new CloudBaseRunServer().express

// 帖子
server.get('/post/get', require('./service/post/getPost').main)
server.get('/post/search', require('./service/post/searchPost').main)
server.post('/post/add', require('./service/post/addPost').main)

// 用户
server.post('/user/add', require('./service/user/addUser').main)
server.get('/user/get', require('./service/user/getUser').main)

async function main() {
  await initDB()
  server.listen(port, () =>
    console.log(`Server ready at: http://localhost:${port}`)
  )
}

main()
