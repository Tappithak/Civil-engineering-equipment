// api/debug/token/route.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request) {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'No token found' });
  }
  
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return NextResponse.json({
      success: true,
      payload: payload,
      availableFields: Object.keys(payload)
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Token verification failed',
      message: error.message
    });
  }
}