// app/api/image-proxy/[fileId]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  // ✅ Await params ก่อนใช้งาน (Next.js 15+)
  const resolvedParams = await params;
  console.log('🖼️ Image Proxy Request (App Router):', resolvedParams);
  
  const { fileId } = resolvedParams;

  // ✅ ตรวจสอบ fileId
  if (!fileId || !fileId.match(/^[a-zA-Z0-9_-]{25,}$/)) {
    console.log('❌ Invalid fileId:', fileId);
    return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
  }

  try {
    console.log('🔄 Fetching from Google Drive:', fileId);

    // ✅ ลองหลายขนาดเผื่อบางขนาดโดน rate limit
    const sizes = ['w800', 'w600', 'w400'];
    let response;
    let lastError;

    for (const size of sizes) {
      const googleDriveUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;
      console.log(`🔍 Trying size ${size}:`, googleDriveUrl);

      try {
        response = await fetch(googleDriveUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Cache-Control': 'no-cache',
          },
          // ใน App Router ใช้ next object แทน timeout
          next: { revalidate: 3600 }, // cache 1 ชั่วโมง
        });

        if (response.ok) {
          console.log(`✅ Successfully fetched from Google Drive (${size})`);
          break;
        } else {
          console.log(`❌ Size ${size} failed:`, response.status, response.statusText);
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (fetchError) {
        console.log(`❌ Fetch error for size ${size}:`, fetchError.message);
        lastError = fetchError;
      }
    }

    // ✅ ถ้าทุกขนาดล้มเหลว
    if (!response || !response.ok) {
      console.log('❌ All sizes failed, redirecting to placeholder');
      
      if (response && response.status === 429) {
        console.log('⚠️ Rate limit detected');
        // ส่ง headers เพิ่มเติม
        return NextResponse.redirect(
          new URL('/images/placeholder.jpg', request.url),
          { 
            status: 307,
            headers: { 'Retry-After': '60' }
          }
        );
      }
      
      return NextResponse.redirect(new URL('/images/placeholder.jpg', request.url));
    }

    // ✅ ตรวจสอบ Content-Type
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    
    if (!contentType || !contentType.startsWith('image/')) {
      console.log('❌ Not an image, redirecting to placeholder');
      return NextResponse.redirect(new URL('/images/placeholder.jpg', request.url));
    }

    // ✅ อ่านข้อมูลรูปภาพ
    const buffer = await response.arrayBuffer();
    console.log('✅ Image proxied successfully, size:', buffer.byteLength, 'bytes');

    // ✅ ส่งรูปภาพกลับ
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
        'Access-Control-Allow-Origin': '*',
        'X-Image-Source': 'google-drive-proxy',
        'X-Image-File-Id': fileId,
      },
    });

  } catch (error) {
    console.error('💥 Proxy error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      fileId: fileId
    });

    return NextResponse.redirect(new URL('/images/placeholder.jpg', request.url));
  }
}

// ✅ เพิ่ม OPTIONS method สำหรับ CORS preflight
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}