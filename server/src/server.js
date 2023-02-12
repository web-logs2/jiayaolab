const cors = require('cors')
const express = require('express')
const morgan = require('morgan')

const logger = morgan('tiny')

class CloudBaseRunServer {
  constructor() {
    this.express = express()
    this.express.use(express.urlencoded({ extended: false }))
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(logger)
  }
}

module.exports.CloudBaseRunServer = CloudBaseRunServer
