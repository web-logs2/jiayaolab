// 模块别名注册器
require('module-alias/register')
const Server = require('./server.js')
const { initDB } = require('./app')
const { useVerify } = require('./util/jwt')

const port = 3000
const server = new Server()
const router = server.express

// 获得帖子
router.get('/post/recommend', require('./service/post/recommendPost').main)

// 获得帖子详情
router.get(
  '/post/detail',
  useVerify(false),
  require('./service/post/detailPost').main
)

// 搜索帖子
router.get('/post/search', require('./service/post/searchPost').main)

// 发布帖子
router.post(
  '/post/submit',
  useVerify(),
  require('./service/post/submitPost').main
)

// 删除帖子
router.delete(
  '/post/remove',
  useVerify(),
  require('./service/post/removePost').main
)

// 获取需要编辑的帖子
router.get(
  '/post/edit/detail',
  useVerify(),
  require('./service/post/detailEditPost').main
)

// 更新编辑后的帖子
router.post(
  '/post/edit/submit',
  useVerify(),
  require('./service/post/submitEditPost').main
)

// 用户注册
router.post('/user/add', require('./service/user/addUser').main)

// 用户登录
router.post('/user/session', require('./service/user/sessionUser').main)

// 用户验证
router.post(
  '/user/session/verify',
  useVerify(),
  require('./service/user/verifyUser').main
)

// 获取用户信息
router.get('/user/info', require('./service/user/getUserInfo').main)

// 更新用户信息
router.post(
  '/user/update',
  useVerify(),
  require('./service/user/updateUser').main
)

// 用户帖子列表
router.get(
  '/user/post/list',
  useVerify(false),
  require('./service/user/userPostList').main
)

// 保存草稿
router.post(
  '/draft/save',
  useVerify(),
  require('./service/draft/saveDraft').main
)

// 获取草稿
router.get(
  '/draft/list',
  useVerify(),
  require('./service/draft/getDraftList').main
)

// 删除草稿
router.delete(
  '/draft/remove',
  useVerify(),
  require('./service/draft/removeDraft').main
)

async function main() {
  // 初始化数据库
  await initDB()
  server.start(port)
}

main().then(() => {
  console.log('Server has been started.')
})
