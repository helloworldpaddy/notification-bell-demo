import React from 'react';
import Navbar from './components/Navbar';
import DataTable from './components/DataTable';
import useNotifications from './hooks/useNotifications';
import './App.css';

function App() {
  // Using userId = 1 for demo purposes
  const userId = 1;
  const { 
    notifications, 
    unreadCount, 
    isConnected, 
    markAsRead 
  } = useNotifications(userId);

  return (
    <div className="App">
      <Navbar
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        isConnected={isConnected}
      />
      
      <main className="main-content">
        <div className="container">
          <DataTable />
        </div>
      </main>
    </div>
  );
}

export default App;
