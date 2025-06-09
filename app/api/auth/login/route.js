// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSheetData } from "../../config";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // ตรวจสอบว่ามี username และ password
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอก username และ password" },
        { status: 400 }
      );
    }

    // ดึงข้อมูล users จาก Google Sheets
    const usersData = await getSheetData("users!A:D");

    if (!usersData || usersData.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลผู้ใช้" },
        { status: 500 }
      );
    }

    // ข้าม header row และหา user ที่ตรงกับ username
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

    // ตรวจสอบรหัสผ่าน
    const hashedPassword = userRow[1];
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // ส่งข้อมูล user กลับไปเฉยๆ ไม่มี JWT หรือ cookies
    return NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        username: userRow[0],
        nameuser: userRow[2],
        device: userRow[3] || "",
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );
  }
}