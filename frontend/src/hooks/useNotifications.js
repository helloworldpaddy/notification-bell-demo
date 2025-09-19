import { useState, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState(null);

  // Fetch historical notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`/api/notifications/${userId}`);
      setNotifications(response.data);
      
      // Count unread notifications
      const unread = response.data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [userId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'http://backend:8080/ws' 
      : 'http://localhost:8080/ws';
    
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(backendUrl),
      connectHeaders: {},
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = function (frame) {
      console.log('Connected: ' + frame);
      setIsConnected(true);
      
      // Subscribe to user-specific notifications
      stompClient.subscribe(`/topic/notifications/${userId}`, function (message) {
        const notification = JSON.parse(message.body);
        console.log('Received notification:', notification);
        
        // Add new notification to the list
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
    };

    stompClient.onStompError = function (frame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      setIsConnected(false);
    };

    stompClient.onDisconnect = function () {
      console.log('Disconnected');
      setIsConnected(false);
    };

    stompClient.activate();
    setClient(stompClient);

    // Fetch initial notifications
    fetchNotifications();

    // Cleanup on unmount
    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [userId, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    fetchNotifications
  };
};

export default useNotifications;
