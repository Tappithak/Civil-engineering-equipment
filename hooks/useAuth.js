// hooks/useAuth.js
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        
        // เพิ่ม role โดยดูจาก username
        const userWithRole = {
          ...userData.user,
          role: userData.user.username === 'Admin' ? 'admin' : 'user'
        };
        
        setUser(userWithRole);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, refresh: fetchCurrentUser };
}