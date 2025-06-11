// lib/auth.js
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies(); // เพิ่ม await
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return {
      username: payload.username,
      name: payload.nameuser,
      role: payload.role || 'user',
      device: payload.device
    };
    
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}