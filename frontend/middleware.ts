import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow large request bodies for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Set a larger body size limit for API routes
    const response = NextResponse.next()
    response.headers.set('x-middleware-body-size-limit', '50mb')
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}
