import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { addDays } from 'date-fns'
import { FollowUpActionSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate with Zod
    const result = FollowUpActionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ 
        error: 'Invalid data', 
        details: result.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const { action, customerId, followUpId, feedback, platform } = result.data

    if (action === 'complete') {
      if (!followUpId) {
        return NextResponse.json({ error: 'Follow-up ID required' }, { status: 400 })
      }

      await db.followUp.update({
        where: { id: followUpId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          feedback: feedback || null
        }
      })

      const customer = await db.customer.findUnique({
        where: { id: customerId }
      })

      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
      }

      const nextStage = customer.followUpStage + 1

      if (nextStage <= 3) {
        const daysUntilNext = nextStage === 2 ? 6 : 14
        const nextDueDate = addDays(new Date(), daysUntilNext)

        await db.followUp.create({
          data: {
            customerId,
            stage: nextStage,
            status: 'PENDING',
            dueDate: nextDueDate
          }
        })

        await db.customer.update({
          where: { id: customerId },
          data: {
            followUpStage: nextStage,
            nextFollowUpDate: nextDueDate
          }
        })
      } else {
        await db.customer.update({
          where: { id: customerId },
          data: {
            followUpStage: 3,
            nextFollowUpDate: null
          }
        })
      }

      return NextResponse.json({ success: true, nextStage })
    }

    if (action === 'skip') {
      if (!followUpId) {
        return NextResponse.json({ error: 'Follow-up ID required' }, { status: 400 })
      }

      await db.followUp.update({
        where: { id: followUpId },
        data: {
          status: 'SKIPPED',
          completedAt: new Date(),
          feedback: feedback || 'Skipped'
        }
      })

      return NextResponse.json({ success: true })
    }

    if (action === 'mark-reviewed') {
      await db.customer.update({
        where: { id: customerId },
        data: {
          reviewStatus: 'LEFT_REVIEW',
          reviewPlatform: platform || 'GOOGLE'
        }
      })

      await db.followUp.updateMany({
        where: {
          customerId,
          status: 'PENDING'
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          feedback: 'Customer left review'
        }
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Follow-up action error:', error)
    return NextResponse.json({ error: 'Failed to process follow-up' }, { status: 500 })
  }
}