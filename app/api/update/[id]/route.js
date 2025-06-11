// app/api/update/route.js  
import { uploadFileToDrive } from '../../config';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file');
    const filename = formData.get('filename') || file.name;
    const fileId = formData.get('fileId'); // ID ของไฟล์เดิมที่จะแทนที่
    
    if (!file || !fileId) {
      return NextResponse.json(
        { message: 'File และ fileId จำเป็นต้องมี' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // อัปโหลดไฟล์ใหม่ (จริงๆแล้วจะสร้างไฟล์ใหม่)
    const uploadedFile = await uploadFileToDrive(
      buffer,
      filename,
      file.type
    );

    return NextResponse.json({
      message: 'File updated successfully',
      file: {
        id: uploadedFile.id,
        name: uploadedFile.name,
        webViewLink: uploadedFile.webViewLink
      }
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating file', error: error.message },
      { status: 500 }
    );
  }
}