import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (customerId) {
      // Get messages for specific customer
      const messages = await db.message.findMany({
        where: { customerId },
        orderBy: { sentAt: 'asc' },
        include: {
          sentBy: {
            select: { name: true }
          }
        }
      })

      return NextResponse.json({ messages })
    }

    // Get all recent messages (for global inbox)
    const messages = await db.message.findMany({
      orderBy: { sentAt: 'desc' },
      take: 50,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            isArchived: true
          }
        },
        sentBy: {
          select: { name: true }
        }
      }
    })

    // Filter out messages from archived customers
    const activeMessages = messages.filter(m => !m.customer.isArchived)

    return NextResponse.json({ messages: activeMessages })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Failed to get messages', details: String(error) },
      { status: 500 }
    )
  }
}