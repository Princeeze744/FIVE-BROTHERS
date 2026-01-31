import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { addDays } from 'date-fns'
import { CreateCustomerSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = { isArchived: false }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { product: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (filter === 'reviewed') {
      where.reviewStatus = 'LEFT_REVIEW'
    } else if (filter === 'pending') {
      where.reviewStatus = 'NONE'
      where.followUpStage = { lt: 3 }
    } else if (filter === 'no-review') {
      where.reviewStatus = 'NONE'
      where.followUpStage = { gte: 3 }
    }

    const [customers, total] = await Promise.all([
      db.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          followUps: {
            where: { status: 'PENDING' },
            orderBy: { dueDate: 'asc' },
            take: 1
          }
        }
      }),
      db.customer.count({ where })
    ])

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Customers GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const result = CreateCustomerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ 
        error: 'Invalid data', 
        details: result.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const data = result.data

    const customer = await db.customer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || null,
        address: data.address,
        city: data.city,
        purchaseDate: new Date(data.purchaseDate),
        deliveryDate: new Date(data.deliveryDate),
        product: data.product,
        specialNote: data.specialNote || null,
        followUpStage: 0,
        nextFollowUpDate: addDays(new Date(data.deliveryDate), 1)
      }
    })

    await db.followUp.create({
      data: {
        customerId: customer.id,
        stage: 1,
        status: 'PENDING',
        dueDate: addDays(new Date(data.deliveryDate), 1)
      }
    })

    return NextResponse.json({
      success: true,
      customer
    }, { status: 201 })
  } catch (error) {
    console.error('Customer POST error:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}