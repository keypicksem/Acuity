export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/record/:path*',
    '/tasks/:path*',
    '/goals/:path*',
    '/insights/:path*',
    '/upgrade/:path*',
  ],
}