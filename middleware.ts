import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Debug log
  console.log('Middleware hit:', pathname);
  
  // Allow access to login page and admin APIs
  if (pathname === '/admin/login' || 
      pathname.startsWith('/api/admin/login') || 
      pathname.startsWith('/api/admin/create')) {
    console.log('Allowing access to:', pathname);
    return NextResponse.next();
  }

  // Skip static files and API routes that don't need auth
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/images') || 
      pathname.startsWith('/favicon') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml') {
    return NextResponse.next();
  }

  // Protect all other routes including root
  const adminNo = request.cookies.get('adminNo')?.value;
  console.log('AdminNo from cookie:', adminNo);
  
  if (!adminNo) {
    console.log('No admin session, redirecting to login');
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  console.log('Admin authenticated, allowing access');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
