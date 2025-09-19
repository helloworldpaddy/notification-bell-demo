import React from 'react';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const Navbar = ({ notifications, unreadCount, onMarkAsRead, isConnected }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Task Manager</h1>
        </div>
        
        <div className="navbar-menu">
          <div className="navbar-item">
            <span className="user-info">👤 User #1</span>
          </div>
          
          <div className="navbar-item">
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={onMarkAsRead}
              isConnected={isConnected}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
