// app/api/add/route.js
import { appendToSheet } from '../config';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse JSON data from request body
    const body = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    const { fname, group, set, path, note } = body;
    
    if (!fname || !group || !set || !path) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'ข้อมูลไม่ครบถ้วน กรุณากรอก fname, group, set, และ path' 
        },
        { status: 400 }
      );
    }

    // สร้าง ID ใหม่ (ใช้ timestamp + random เพื่อความเป็นเอกลักษณ์)
    const newId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // เตรียมข้อมูลที่จะเพิ่มลงใน Sheet
    // โครงสร้าง: [id, fname, path, group, set, note]
    const newRowData = [
      ['', fname, path, note || '', group, set, ]
    ];

    // กำหนด range สำหรับ personnel sheet
    const range = 'personnel!A:F'; // หรือใช้ range ที่เฉพาะเจาะจงมากขึ้น เช่น 'personnel!A2:F'
    
    // เพิ่มข้อมูลลงใน Google Sheet
    const result = await appendToSheet(range, newRowData);
    
    // ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      message: 'เพิ่มข้อมูลเรียบร้อยแล้ว',
      data: {
        id: newId,
        fname,
        path,
        group,
        set,
        note: note || '',
        spreadsheetResponse: result
      }
    }, { status: 201 });

  } catch (error) {
    console.error('API Add Error:', error);
    
    // ตรวจสอบประเภทของ error
    let errorMessage = 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล';
    
    if (error.message.includes('Unable to parse range')) {
      errorMessage = 'ข้อผิดพลาดในการระบุ range ของ Google Sheet';
    } else if (error.message.includes('Sheets API has not been used')) {
      errorMessage = 'Google Sheets API ยังไม่ได้เปิดใช้งาน';
    } else if (error.message.includes('The caller does not have permission')) {
      errorMessage = 'ไม่มีสิทธิ์เข้าถึง Google Sheet';
    }

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// เพิ่ม OPTIONS method สำหรับ CORS (ถ้าจำเป็น)
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}