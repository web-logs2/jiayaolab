import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

/**
 * 配置跨域
 * 允许不同域名访问此服务
 */
app.all('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, OPTIONS, DELETE, PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since'
  )
  res.setHeader('Content-Type', 'application/json;charset=utf-8')
  next()
})

/**
 * 根据类别参数查询帖子
 */
app.get('/post/category', async (req, res) => {
  const { current, sortField } = req.query

  try {
    // 请求必要参数
    if (!(current && sortField)) {
      res.status(400).json({ code: 400, data: null, message: '缺少必要参数！' })
    } else {
      // 单次查询最大数量
      const onceTake = 5
      const posts = await prisma.post.findMany({
        take: onceTake,
        skip: Number(current) * onceTake - onceTake,
        orderBy: {
          [sortField as string]: 'desc',
        },
      })

      res.status(200).json({
        code: 200,
        data: posts,
        message: 'ok',
      })
    }
  } catch (e) {
    res.status(400).json({
      code: 400,
      data: null,
      message: '发生错误，请检查参数是否正确！',
    })
  }
})

/**
 * 根据条件参数查询帖子
 */
app.get('/post/condition', async (req, res) => {
  const { current, sortField, sortOrder, keywords } = req.query

  try {
    // 请求必要参数
    if (!(current && sortField && sortOrder)) {
      res.status(400).json({ code: 400, data: null, message: '缺少必要参数！' })
    } else {
      // 单次查询最大数量
      const onceTake = 5
      const posts = await prisma.post.findMany({
        take: onceTake,
        skip: Number(current) * onceTake - onceTake,
        // 在标题或正文当中包含指定的关键字就返回该帖子
        where: {
          OR: [
            { title: { contains: keywords as string } },
            { content: { contains: keywords as string } },
          ],
        },
        orderBy: {
          [sortField as string]: sortOrder,
        },
      })

      res.status(200).json({
        code: 200,
        data: posts,
        message: 'ok',
      })
    }
  } catch (e) {
    res.status(400).json({
      code: 400,
      data: null,
      message: '发生错误，请检查参数是否正确！',
    })
  }
})

/**
 * 发布帖子
 */
app.post('/post', async (req, res) => {
  const { title, content, published } = req.body

  try {
    // 请求必要参数
    if (!(title && content && published)) {
      res.status(400).json({ code: 400, data: null, message: '缺少必要参数！' })
    } else {
      await prisma.post.create({
        data: {
          title,
          content,
          published,
        },
      })
      res.status(201).json({ code: 201, data: '帖子发布成功！', message: 'ok' })
    }
  } catch (e) {
    res.status(400).json({
      code: 400,
      data: null,
      message: '发生错误，请检查参数是否正确！',
    })
  }
})

/**
 * 根据ID查询帖子
 */
app.get('/post/detail', async (req, res) => {
  const { id } = req.query

  try {
    // 请求必要参数
    if (!id) {
      res.status(400).json({ code: 400, data: null, message: '缺少必要参数！' })
    } else {
      const post = await prisma.post.findUnique({
        where: {
          id: Number(id),
        },
      })

      // 返回帖子 & 返回帖子不存在
      res.status(post ? 200 : 404).json({
        code: post ? 200 : 404,
        data: post ? post : null,
        message: post ? 'ok' : '该帖子不存在或已被作者删除！',
      })
    }
  } catch (e) {
    res.status(400).json({
      code: 400,
      data: null,
      message: '发生错误，请检查参数是否正确！',
    })
  }
})

// 启动服务
app.listen(3000, () => console.log(`Server ready at: http://localhost:3000`))
