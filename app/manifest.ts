import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NPD Smart Logistics Hub Application',
    short_name: 'NPD',
    description: 'แอปพลิเคชันระบบส่งกำลังบำรุงสายช่างโยธา เพื่อสนับสนุนภารกิจกองทัพเรือ และรองรับสถานการณ์วิกฤต',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}