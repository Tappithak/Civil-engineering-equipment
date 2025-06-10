import { updateSheetData } from '../../config';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const { id } = await params;
  const userName = request.headers.get('x-user-name');

  try {
    if (!id) {
      return NextResponse.json(
        { message: 'File ID is required' },
        { status: 400 }
      );
    }
    console.log('Received DELETE request for file ID:', userName, id);
    // const softdatele = await updateSheetData(
    //     'personnel!A'+id+1 +':H'+id+1, // ปรับให้ตรงกับแถวที่ต้องการลบ
    //     id
        
    // );
    // if (!softdatele) {
    //   return NextResponse.json(
    //     { message: 'File not found or already deleted' },
    //     { status: 404 }
    //   );
    // }

    // ส่งข้อความยืนยันการลบไฟล์
    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    // console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Error deleting file', error: error.message },
      { status: 500 }
    );
  }
}