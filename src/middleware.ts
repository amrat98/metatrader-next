import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apiConfig } from '@/lib/api-config'
import axios from 'axios'
import { routes } from '@/lib/routes'

async function getMaintenanceStatus() {
  try {
    const response = await axios.get(apiConfig.system.siteMaintainence, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return false;
    if (response.data.statusCode === 200) {
      return response.data.result?.status || false;
    }
    return false;
  } catch (error) {
    console.error('Error fetching maintenance status:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  // if (request.nextUrl.pathname === '/') {
  //   return NextResponse.redirect(new URL(routes.login, request.url));
  // }
  // Custom redirects
  // if (request.nextUrl.pathname === '/home') {
  //   return NextResponse.redirect(new URL(routes.login, request.url));
  // }
  // if (request.nextUrl.pathname === '/signup') {
  //   return NextResponse.redirect(new URL(routes.register, request.url));
  // }
  // if (request.nextUrl.pathname === '/signin') {
  //   return NextResponse.redirect(new URL(routes.login, request.url));
  // }

  // Allow access to maintenance page and landing page
  if (request.nextUrl.pathname === routes.maintenance) {
    return NextResponse.next()
  }

  // Check maintenance status from API
  const isMaintenance = await getMaintenanceStatus();

  // Redirect all other pages to maintenance page if maintenance mode is enabled
  if (isMaintenance) {
    return NextResponse.redirect(new URL(routes.maintenance, request.url))
  }

  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith(routes.login) || 
                    request.nextUrl.pathname.startsWith(routes.register)
                    //  ||
                    // request.nextUrl.pathname.startsWith(routes.verify) ||
                    // request.nextUrl.pathname.startsWith(routes.updatePassword)

  // If trying to access auth pages while logged in, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL(routes.dashboard, request.url))
  }
  
  const notAuthPage = request.nextUrl.pathname.startsWith(routes.dashboard) || 
  request.nextUrl.pathname.startsWith(routes.team) ||
  request.nextUrl.pathname.startsWith(routes.investment) ||
  request.nextUrl.pathname.startsWith(routes.income) ||
  request.nextUrl.pathname.startsWith(routes.assets) ||
  request.nextUrl.pathname.startsWith(routes.profile) ||
  request.nextUrl.pathname.startsWith(routes.linkAccount) ||
  request.nextUrl.pathname.startsWith(routes.subscription) ||
  request.nextUrl.pathname.startsWith(routes.support)

  // If trying to access dashboard without token, redirect to login
  if (notAuthPage && !token) {
    return NextResponse.redirect(new URL(routes.login, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
} 