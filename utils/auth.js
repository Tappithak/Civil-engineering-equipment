// // utils/auth.js - Helper functions สำหรับ client-side
// export function getUser() {
//   if (typeof window === 'undefined') return null;
  
//   const userInfo = document.cookie
//     .split('; ')
//     .find(row => row.startsWith('user_info='));
    
//   if (userInfo) {
//     try {
//       return JSON.parse(decodeURIComponent(userInfo.split('=')[1]));
//     } catch (error) {
//       return null;
//     }
//   }
  
//   return null;
// }

// export function isAuthenticated() {
//   if (typeof window === 'undefined') return false;
  
//   const token = document.cookie
//     .split('; ')
//     .find(row => row.startsWith('auth_token='));
    
//   return !!token;
// }

// export async function logout() {
//   try {
//     const response = await fetch('/api/auth/logout', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
    
//     if (response.ok) {
//       window.location.href = '/menu';
//     }
//   } catch (error) {
//     console.error('Logout error:', error);
//   }
// }