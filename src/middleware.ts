import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')
    const isLoginPage = request.nextUrl.pathname === '/login'

    // Public paths that don't need auth (assets, etc)
    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // If user has token and is on login page, redirect to home
    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // If user has NO token and is NOT on login page, redirect to login
    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
