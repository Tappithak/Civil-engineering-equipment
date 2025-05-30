import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const token = req.cookies.token; // ดึง token จาก cookies
  // ตรวจสอบว่ามี token หรือไม่
  if (!token) {
    return res.status(401).json({ valid: false, message: 'Token is missing' });
  }

  try {
    // ตรวจสอบและ decode token
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

    // ส่งข้อมูล user กลับไป
    res.status(200).json({ 
      valid: true, 
      user: decoded.username 
    });
  } catch (error) {
    // Token ไม่ถูกต้อง
    res.status(401).json({ 
      valid: false, 
      message: error.message // บอกเหตุผลข้อผิดพลาด
    });
  }
}
