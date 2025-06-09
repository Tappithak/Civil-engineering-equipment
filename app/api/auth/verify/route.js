// app/api/auth/verify/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // 🔍 อ่าน token จาก cookie
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ token' },
        { status: 401 }
      );
    }

    // 🔍 ตรวจสอบ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔍 ตรวจสอบว่า token หมดอายุหรือยัง
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return NextResponse.json(
        { success: false, message: 'Token หมดอายุ' },
        { status: 401 }
      );
    }

    console.log('✅ Token verified for user:', decoded.username);

    return NextResponse.json({
      success: true,
      user: {
        username: decoded.username,
        nameuser: decoded.nameuser,
        device: decoded.device
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Token ไม่ถูกต้อง' },
      { status: 401 }
    );
  }
}