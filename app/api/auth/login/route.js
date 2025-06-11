// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getSheetData } from "../../config";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอก username และ password" },
        { status: 400 }
      );
    }

    const usersData = await getSheetData("users!A:E");

    if (!usersData || usersData.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลผู้ใช้" },
        { status: 500 }
      );
    }

    const userRows = usersData.slice(1);
    const userRow = userRows.find(
      (row) => row[0] && row[0].toLowerCase() === username.toLowerCase()
    );

    if (!userRow) {
      return NextResponse.json(
        { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const hashedPassword = userRow[1];
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // สร้าง JWT Token
    const payload = {
      username: userRow[0],
      nameuser: userRow[2],
      device: userRow[3] || "",
      role: userRow[4] || "user",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    console.log('✅ JWT Token created for user:', userRow[0]);

    // 🆕 สร้าง Response พร้อม Cookies
    const response = NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        username: userRow[0],
        nameuser: userRow[2],
        device: userRow[3] || "",
        role: userRow[4] || "user",
      },
      token: token,
    });

    // 🆕 ตั้งค่า HTTP-Only Cookie สำหรับความปลอดภัย
    response.cookies.set('auth_token', token, {
      httpOnly: true,        // ป้องกัน XSS
      secure: false,         // false สำหรับ localhost
      sameSite: 'lax',       // ป้องกัน CSRF
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
    });

    // 🆕 ตั้งค่า User Info Cookie สำหรับ Client
    response.cookies.set('user_info', JSON.stringify({
      username: userRow[0],
      nameuser: userRow[2],
      role: userRow[4] || "user",
      device: userRow[3] || "",
    }), {
      httpOnly: false,       // อนุญาตให้ client อ่านได้
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    console.log('🍪 Cookies set successfully');
    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );
  }
}