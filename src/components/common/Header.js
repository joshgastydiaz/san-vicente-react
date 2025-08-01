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

export default function Header({ setPage, currentUser }) {
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

  const handleNavClick = (page) => {
    setPage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <h1 onClick={() => handleNavClick('home')}>Brgy. San Vicente</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="header__nav--desktop">
          {navLinks.map(link => (
            <button key={link.name} onClick={() => handleNavClick(link.page)} className="header__nav-link">
              {link.name}
            </button>
          ))}
          {currentUser ? (
            <>
              <button onClick={() => handleNavClick('adminDashboard')} className="header__nav-link">Dashboard</button>
              <button onClick={() => handleNavClick('profile')} className="header__nav-link">Profile</button>
              <Button onClick={handleLogout} className="btn--danger">Logout</Button>
            </>
          ) : (
            <Button onClick={() => handleNavClick('login')}>Login</Button>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="header__menu-toggle">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="header__nav--mobile">
          {navLinks.map(link => (
            <button key={link.name} onClick={() => handleNavClick(link.page)} className="header__nav-link--mobile">
              {link.name}
            </button>
          ))}
          {currentUser ? (
            <>
              <button onClick={() => handleNavClick('adminDashboard')} className="header__nav-link--mobile">Dashboard</button>
              <button onClick={() => handleNavClick('profile')} className="header__nav-link--mobile">Profile</button>
              <Button onClick={handleLogout} className="btn--danger btn--full-width">Logout</Button>
            </>
          ) : (
            <Button onClick={() => handleNavClick('login')} className="btn--full-width">Login</Button>
          )}
        </nav>
      )}
    </header>
  );
}
