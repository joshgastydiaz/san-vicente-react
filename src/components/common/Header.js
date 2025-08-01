import React, { useState } from 'react';
import { auth } from '../../firebase'; 
import { signOut } from 'firebase/auth';
import { Button } from './Button';

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Header({ setPage, currentUser, userType }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPage('home');
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'About Us', page: 'about' },
    { name: 'Services', page: 'services' },
    { name: 'Announcements', page: 'announcements' },
    { name: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (pageName) => {
    setPage(pageName);
    setIsMenuOpen(false);
  };

  return (
    <header className="header bg-white shadow-md">
      <div className="header__container flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        
        {/* Brand + Logo */}
        <div 
          className="header__brand flex items-center gap-2 cursor-pointer" 
          onClick={() => handleNavClick('home')}
        >
       <img src="/logo.png" alt="Brgy Logo" style={{ height: '50px', width: '50px' }} className="object-contain" />


          <h1 className="text-2xl font-bold text-gray-800">Barangay San Vicente</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="header__nav--desktop hidden md:flex items-center gap-4">
          {navLinks.map(link => (
            <button 
              key={link.name} 
              onClick={() => handleNavClick(link.page)} 
              className="header__nav-link text-gray-700 hover:text-blue-600"
            >
              {link.name}
            </button>
          ))}

          {currentUser ? (
            <>
              {userType === 'admin' && (
                <button 
                  onClick={() => handleNavClick('adminDashboard')} 
                  className="header__nav-link text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </button>
              )}
              <button 
                onClick={() => handleNavClick('profile')} 
                className="header__nav-link text-gray-700 hover:text-blue-600"
              >
                Profile
              </button>
              <Button onClick={handleLogout} className="btn--danger ml-2">
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => handleNavClick('login')} className="ml-2">
              Login
            </Button>
          )}
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden header__menu-toggle">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="header__nav--mobile bg-white shadow-inner md:hidden">
          <div className="flex flex-col gap-2 px-6 py-4">
            {navLinks.map(link => (
              <button 
                key={link.name} 
                onClick={() => handleNavClick(link.page)} 
                className="header__nav-link--mobile text-left text-gray-700 hover:text-blue-600"
              >
                {link.name}
              </button>
            ))}

            {currentUser ? (
              <>
                {userType === 'admin' && (
                  <button 
                    onClick={() => handleNavClick('adminDashboard')} 
                    className="header__nav-link--mobile text-left text-gray-700 hover:text-blue-600"
                  >
                    Dashboard
                  </button>
                )}
                <button 
                  onClick={() => handleNavClick('profile')} 
                  className="header__nav-link--mobile text-left text-gray-700 hover:text-blue-600"
                >
                  Profile
                </button>
                <Button onClick={handleLogout} className="btn--danger btn--full-width mt-2">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => handleNavClick('login')} className="btn--full-width mt-2">
                Login
              </Button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
