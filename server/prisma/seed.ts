import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)
  for (let i = 0; i < 200; i++) {
    const post = await prisma.post.create({
      data: {
        title: `我是标题Title#${Math.floor(Math.random() * 20000)}`,
        content: Array.from({ length: 95 }).join('内容'),
        published: true,
        viewCount: Math.floor(Math.random() * 15000),
        author: {
          connectOrCreate: {
            create: {
              name: 'example',
              email: 'example@example.com',
            },
            where: {
              email: 'example@example.com',
            },
          },
        },
      },
    })
    console.log('Created', post)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
