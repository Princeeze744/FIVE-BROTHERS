import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { SendMessageSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate with Zod
    const result = SendMessageSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ 
        error: 'Invalid data', 
        details: result.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const { customerId, body: messageBody } = result.data

    const customer = await db.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const message = await db.message.create({
      data: {
        body: messageBody,
        direction: 'OUTBOUND',
        customerId,
        sentById: (session.user as any).id
      }
    })

    return NextResponse.json({ 
      success: true, 
      message,
      note: 'Message saved. SMS sending will be enabled once Twilio is configured.'
    })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}