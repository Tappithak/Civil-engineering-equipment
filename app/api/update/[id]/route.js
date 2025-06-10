// app/api/update/[id]/route.js
import { NextResponse } from 'next/server';
import { getSheetData, updateSheetData } from '../../config.js';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();

    // ค้นหา row index ของ item ที่ต้องการอัพเดต
    const allData = await getSheetData('Sheet1!A2:F1000');
    const rowIndex = allData?.findIndex(row => row[0] === id);

    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลที่ต้องการแก้ไข' },
        { status: 404 }
      );
    }

    // คำนวณ row number ใน sheet (เริ่มจาก row 2)
    const sheetRowNumber = rowIndex + 2;
    
    // เตรียมข้อมูลสำหรับอัพเดต
    const currentRow = allData[rowIndex];
    const updatedRow = [
      id, // ID ไม่เปลี่ยน
      updateData.fname || currentRow[1],
      currentRow[2], // path ไม่เปลี่ยน
      updateData.note !== undefined ? updateData.note : currentRow[3],
      updateData.group || currentRow[4],
      updateData.set || currentRow[5]
    ];

    // อัพเดตข้อมูลใน Google Sheets
    await updateSheetData(`personnel!A${sheetRowNumber}:F${sheetRowNumber}`, [updatedRow]);

    return NextResponse.json({
      success: true,
      message: 'อัพเดตข้อมูลเรียบร้อยแล้ว',
      data: {
        id,
        fname: updatedRow[1],
        path: updatedRow[2],
        note: updatedRow[3],
        group: updatedRow[4],
        set: updatedRow[5]
      }
    });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัพเดต: ' + error.message },
      { status: 500 }
    );
  }
}
