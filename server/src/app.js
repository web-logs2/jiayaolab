const { Sequelize, DataTypes } = require('sequelize')

const [host, port] = process.env.MYSQL_ADDRESS.split(':')

const app = new Sequelize({
  database: 'forum_data',
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  host,
  port,
  dialect: 'mysql',
})

// 用户信息
const User = app.define(
  'user',
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  }
)
// 帖子信息
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
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  html: {
    type: DataTypes.TEXT('medium'),
    allowNull: false,
  },
  _public: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
})

Post.belongsTo(User)

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
