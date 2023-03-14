const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const logger = morgan('tiny')

class CloudBaseRunServer {
  constructor() {
    this.express = express()
    this.express.use(express.urlencoded({ extended: false }))
    this.express.use(bodyParser.json({ limit: '50mb' }))
    this.express.use(
      bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
      })
    )
    this.express.use(cors())
    this.express.use(logger)
  }
}

module.exports.CloudBaseRunServer = CloudBaseRunServer
