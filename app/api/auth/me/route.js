// app/api/auth/me/route.js
import { getCurrentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        name: user.name,
        role: user.role || 'user',
        device: user.device
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching user info' },
      { status: 500 }
    );
  }
}