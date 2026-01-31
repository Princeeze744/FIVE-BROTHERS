import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Base filter - exclude archived customers
    const activeCustomerFilter = { isArchived: false }

    const [
      totalCustomers,
      reviewedCustomers,
      pendingFollowUps,
      neverReviewed,
      pendingFollowUpsList,
      recentCustomers
    ] = await Promise.all([
      // Count only active (non-archived) customers
      db.customer.count({
        where: activeCustomerFilter
      }),

      // Count reviewed customers (non-archived)
      db.customer.count({
        where: {
          ...activeCustomerFilter,
          reviewStatus: 'LEFT_REVIEW'
        }
      }),

      // Count pending follow-ups for active customers only
      db.followUp.count({
        where: {
          status: 'PENDING',
          dueDate: { lte: new Date() },
          customer: activeCustomerFilter
        }
      }),

      // Count customers who completed all stages without review (non-archived)
      db.customer.count({
        where: {
          ...activeCustomerFilter,
          followUpStage: { gte: 3 },
          reviewStatus: 'NONE'
        }
      }),

      // Get pending follow-ups list for active customers
      db.followUp.findMany({
        where: {
          status: 'PENDING',
          dueDate: { lte: new Date() },
          customer: activeCustomerFilter
        },
        include: { customer: true },
        orderBy: { dueDate: 'asc' },
        take: 10
      }),

      // Get recent customers (non-archived only)
      db.customer.findMany({
        where: activeCustomerFilter,
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ])

    // Calculate review rate
    const reviewRate = totalCustomers > 0
      ? Math.round((reviewedCustomers / totalCustomers) * 100)
      : 0

    return NextResponse.json({
      stats: {
        totalCustomers,
        reviewedCustomers,
        pendingFollowUps,
        neverReviewed,
        reviewRate
      },
      pendingFollowUps: pendingFollowUpsList,
      recentCustomers
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch dashboard data'
    }, { status: 500 })
  }
}