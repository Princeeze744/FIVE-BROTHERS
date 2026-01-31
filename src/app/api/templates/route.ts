import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET all templates
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templates = await db.template.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Get templates error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates', details: String(error) },
      { status: 500 }
    )
  }
}

// POST create new template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, body } = await request.json()

    if (!name || !body) {
      return NextResponse.json(
        { error: 'Name and body are required' },
        { status: 400 }
      )
    }

    const template = await db.template.create({
      data: {
        name,
        body,
        isActive: true
      }
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('Create template error:', error)
    return NextResponse.json(
      { error: 'Failed to create template', details: String(error) },
      { status: 500 }
    )
  }
}