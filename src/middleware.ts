import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  }
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/customers/:path*',
    '/messages/:path*',
    '/templates/:path*',
    '/settings/:path*'
  ]
}