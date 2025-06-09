// utils/auth.js
export function getUser() {
  if (typeof window === 'undefined') return null;
  
  const userInfo = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_info='));
    
  if (userInfo) {
    try {
      return JSON.parse(decodeURIComponent(userInfo.split('=')[1]));
    } catch (error) {
      return null;
    }
  }
  
  return null;
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  
  const userInfo = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_info='));
    
  return !!userInfo;
}

export async function verifyAuth() {
  try {
    const response = await fetch('/api/auth/verify');
    const data = await response.json();
    return data.success ? data.user : null;
  } catch (error) {
    return null;
  }
}