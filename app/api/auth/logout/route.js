// app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'ออกจากระบบสำเร็จ'
    });

    // 🍪 ลบ cookies
    response.cookies.delete('auth_token');
    response.cookies.delete('user_info');

    console.log('🍪 Cookies cleared');
    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการออกจากระบบ' },
      { status: 500 }
    );
  }
}