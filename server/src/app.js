const { Sequelize, DataTypes } = require('sequelize')

const [host, port] = process.env.MYSQL_ADDRESS.split(':')

const app = new Sequelize({
  database: 'blog_data',
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  host,
  port,
  dialect: 'mysql',
})

const User = app.define(
  'user',
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  }
)
const Post = app.define('post', {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT('medium'),
    allowNull: false,
  },
  publicly: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
})

const initDB = async () => {
  try {
    await app.authenticate()
    console.log('Connection has been established successfully.')
    await app.sync({ alter: true })
    console.log('All databases synced.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

module.exports = app
module.exports = {
  initDB,
  User,
  Post,
}
