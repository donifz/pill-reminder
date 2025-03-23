'use client';

import { useRouter } from 'next/navigation';
import { authApi } from '../services/auth';
import { useState, useEffect } from 'react';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(authApi.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authApi.isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authApi.getCurrentUser();
      const isAuth = authApi.isAuthenticated();
      setUser(currentUser);
      setIsAuthenticated(isAuth);
    };

    checkAuth();
    // Check auth state every second
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Medicine Tracker</h1>
          {user && (
            <span className="ml-4 text-gray-600">
              Welcome, {user.name}!
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
} 