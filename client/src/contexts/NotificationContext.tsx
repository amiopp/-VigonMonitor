import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';

// Notification types and interfaces
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  category: 'security' | 'network' | 'maintenance' | 'user' | 'system' | 'general';
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByCategory: (category: Notification['category']) => Notification[];
  getNotificationsByType: (type: Notification['type']) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Start empty; we will pull from backend
const initialNotifications: Notification[] = [];

export const NotificationProvider: React.FC<{ children: React.ReactNode; hotelId?: string }> = ({ children, hotelId }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  // Load notifications from backend when hotelId changes
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await apiRequest('GET', `/api/notifications${hotelId ? `?hotelId=${encodeURIComponent(hotelId)}` : ''}`);
        const data = await res.json();
        const normalized: Notification[] = (data || []).map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type === 'alert' ? 'warning' : 'info',
          category: n.type === 'alert' ? 'system' : 'general',
          timestamp: new Date(n.timestamp),
          read: false,
          priority: n.type === 'alert' ? 'high' : 'low',
        }));
        setNotifications(normalized);
      } catch {
        // keep silent; context still works locally
      }
    };
    fetchNotifs();
  }, [hotelId]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Add new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get notifications by category
  const getNotificationsByCategory = useCallback((category: Notification['category']) => {
    return notifications.filter(n => n.category === category);
  }, [notifications]);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Auto-mark notifications as read after 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => 
        prev.map(n => {
          if (!n.read && Date.now() - n.timestamp.getTime() > 30000) {
            return { ...n, read: true };
          }
          return n;
        })
      );
    }, 10000); // Check every 10 seconds

    return () => clearInterval(timer);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByCategory,
    getNotificationsByType
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Toast Component
export const NotificationToast: React.FC<{ notification: Notification; onClose: () => void }> = ({ 
  notification, 
  onClose 
}) => {
  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'system':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      case 'system':
        return '⚙';
      default:
        return '•';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg ${getTypeStyles(notification.type)}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="text-lg">{getTypeIcon(notification.type)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{notification.title}</p>
          <p className="text-sm mt-1 opacity-90">{notification.message}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs opacity-75">
              {notification.timestamp.toLocaleTimeString()}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-white/50">
              {notification.category}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

