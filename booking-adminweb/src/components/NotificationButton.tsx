'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: number;
  type: 'booking' | 'cancellation';
  message: string;
  is_read: boolean;
  created_at: string;
  customer_name?: string;
  booking_date?: string;
  participants?: number;
}

export default function NotificationButton() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark-as-read',
          notificationId,
        }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark-all-as-read' }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const displayCount = unreadCount > 9 ? '9+' : unreadCount;

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition flex items-center gap-2"
      >
        🔔 Notifications
        {unreadCount > 0 && (
          <span className="ml-2 inline-block min-w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {displayCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-slate-800 border border-cyan-500/30 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
            <h3 className="font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-cyan-300 hover:text-cyan-200"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-slate-400">
              No notifications yet
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-700/50 transition ${
                  !notif.is_read ? 'bg-slate-700/30' : 'bg-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold ${notif.type === 'booking' ? 'text-green-400' : 'text-red-400'}`}>
                        {notif.type === 'booking' ? '📅' : '❌'} {notif.type === 'booking' ? 'New Booking' : 'Cancellation'}
                      </span>
                      {!notif.is_read && (
                        <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-white text-sm">{notif.message}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
