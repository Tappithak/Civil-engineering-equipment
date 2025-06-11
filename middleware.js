// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // ใช้ jose แทน jsonwebtoken เพราะรองรับ Edge Runtime

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // ข้าม static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  console.log('🛡️ Middleware - Path:', pathname);

  const token = request.cookies.get('auth_token')?.value;
  
  // สำหรับหน้าที่ต้อง login
  if (pathname === '/menu' || pathname === '/equipment' || pathname === '/mapallequipment' || pathname === '/personnel' || pathname === '/documents') {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  const response = NextResponse.next();
  
  // ถ้ามี token ให้ decode เพื่อดึงข้อมูล user
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      console.log('📋 JWT Payload:', payload);
      
      // ส่งข้อมูล user ผ่าน headers ไปให้ API routes
      response.headers.set('x-user-id', payload.username || payload.id || '');
      response.headers.set('x-user-name', payload.nameuser || '');
      response.headers.set('x-user-role', payload.role || 'user');


      
    } catch (error) {
      console.log('❌ JWT verification failed:', error.message);
      
      // ถ้า token หมดอายุหรือผิด redirect ไป login
      if (pathname === '/menu' || pathname === '/equipment' || pathname === '/mapallequipment' || pathname === '/personnel' || pathname === '/documents') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.).*)',
  ],
};