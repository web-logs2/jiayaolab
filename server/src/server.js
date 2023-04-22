const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

// 服务器日志
const logger = morgan('combined')

class CloudBaseRunServer {
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
  }
}

module.exports = CloudBaseRunServer
