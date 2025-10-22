import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';

export default function GlobalNotificationManager() {
  const { notifications } = useNotifications();
  const { toast } = useToast();

  // Show toast notifications for new high-priority notifications
  useEffect(() => {
    const newNotifications = notifications.filter(n => !n.read);
    
    newNotifications.forEach(notification => {
      if (notification.priority === 'critical' || notification.priority === 'high') {
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type === 'error' ? 'destructive' : 
                  notification.type === 'warning' ? 'default' : 
                  notification.type === 'success' ? 'default' : 'default',
          duration: notification.priority === 'critical' ? 10000 : 5000,
        });
      }
    });
  }, [notifications, toast]);

  return null; // This component doesn't render anything visible
}

