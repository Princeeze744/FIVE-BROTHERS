import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fivebrothers.com' },
    update: {},
    create: {
      email: 'admin@fivebrothers.com',
      name: 'Admin',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYr.BCPZWWWC',
      role: 'ADMIN',
      isActive: true
    }
  })

  console.log('Created admin user:', admin)

  // Create default templates
  const templates = await prisma.template.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'First Follow-up',
        body: 'Hi {firstName}, thank you for choosing Five Brothers Appliances! We hope you are enjoying your {product}. Would you mind leaving us a quick review? It really helps our small business. Thank you!'
      },
      {
        name: 'Second Follow-up',
        body: 'Hi {firstName}, just checking in! How is your {product} working out? If you have a moment, we would greatly appreciate a review. Thank you for your support!'
      },
      {
        name: 'Final Follow-up',
        body: 'Hi {firstName}, we hope everything is going well with your {product}. This is our last reminder - if you could leave us a review, it would mean the world to us. Thank you!'
      }
    ]
  })

  console.log('Created templates')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })