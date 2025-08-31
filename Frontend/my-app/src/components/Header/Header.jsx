import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GuestDesktop from './guest_desktop';
import GuestMobile from './guest_mobile';
import UserDesktop from './user_desktop';
import UserMobile from './user_mobile';
import AdminDesktop from './admin_desktop';
import AdminMobile from './admin_mobile';

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  /* --- detect login --- */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  /* --- responsive check --- */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* --- logout --- */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsSidebarOpen(false);
    navigate('/');
  };

  /* --- sidebar toggle --- */
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  /* --- decide view --- */
  if (!isLoggedIn) {
    return isMobile 
      ? <GuestMobile toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      : <GuestDesktop />;
  }

  if (user?.admin) {
    return isMobile 
      ? <AdminMobile user={user} handleLogout={handleLogout} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      : <AdminDesktop user={user} handleLogout={handleLogout} />;
  }

  return isMobile 
    ? <UserMobile user={user} handleLogout={handleLogout} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
    : <UserDesktop user={user} handleLogout={handleLogout} />;
}

export default Header;
