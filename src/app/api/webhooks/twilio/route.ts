import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const from = formData.get('From') as string
    const body = formData.get('Body') as string
    const messageSid = formData.get('MessageSid') as string

    if (!from || !body) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Clean phone number for lookup
    const cleanPhone = from.replace(/\D/g, '').slice(-10)

    // Find customer by phone number
    const customer = await db.customer.findFirst({
      where: {
        OR: [
          { phone: { contains: cleanPhone } },
          { phone: from }
        ]
      }
    })

    if (customer) {
      // Save incoming message
      await db.message.create({
        data: {
          body,
          direction: 'INBOUND',
          twilioSid: messageSid,
          customerId: customer.id
        }
      })
    }

    // Return TwiML response
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' }
      }
    )
  } catch (error) {
    console.error('Twilio webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}