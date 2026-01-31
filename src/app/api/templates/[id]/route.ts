import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET single template
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

    const template = await db.template.findUnique({
      where: { id }
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Get template error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template', details: String(error) },
      { status: 500 }
    )
  }
}

// PATCH update template
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
    const data = await request.json()

    const template = await db.template.update({
      where: { id },
      data: {
        name: data.name,
        body: data.body,
        isActive: data.isActive
      }
    })

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Update template error:', error)
    return NextResponse.json(
      { error: 'Failed to update template', details: String(error) },
      { status: 500 }
    )
  }
}

// DELETE template
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

    await db.template.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete template error:', error)
    return NextResponse.json(
      { error: 'Failed to delete template', details: String(error) },
      { status: 500 }
    )
  }
}