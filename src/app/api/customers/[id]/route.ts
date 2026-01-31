import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { UpdateCustomerSchema } from '@/lib/validations'

// GET single customer with messages and follow-ups
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const customer = await db.customer.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { sentAt: 'asc' }
        },
        followUps: {
          orderBy: { stage: 'asc' }
        }
      }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({ customer })
  } catch (error) {
    console.error('Customer GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}

// PATCH update customer
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Validate with Zod
    const result = UpdateCustomerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ 
        error: 'Invalid data', 
        details: result.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const customer = await db.customer.update({
      where: { id },
      data: result.data
    })

    return NextResponse.json({ success: true, customer })
  } catch (error) {
    console.error('Customer PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

// DELETE customer (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await db.customer.update({
      where: { id },
      data: { isArchived: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Customer DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}