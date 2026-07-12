import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { timeAgo } from '../../utils/formatters';
import styles from './Layout.module.css';

export default function NotificationDropdown({ onClose }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: notificationsData, isLoading } = useNotifications(user?.id);
  const markReadMutation = useMarkNotificationRead(user?.id);
  const markAllReadMutation = useMarkAllNotificationsRead(user?.id);

  const notifications = Array.isArray(notificationsData) 
    ? notificationsData 
    : (notificationsData?.data?.notifications || notificationsData?.notifications || (Array.isArray(notificationsData?.data) ? notificationsData.data : []));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const handleItemClick = async (notif) => {
    try {
      const isUnread = !notif.read && !notif.isRead;
      if (isUnread) {
        await markReadMutation.mutateAsync(notif._id || notif.id);
      }
      if (notif.link) {
        navigate(notif.link);
      } else if (notif.meta?.sessionId) {
        navigate('/student');
      }
      onClose();
    } catch (err) {
      console.error('Failed to handle notification click:', err);
    }
  };

  return (
    <div className={styles.notifDropdown} ref={ref}>
      <div className={styles.notifHeader}>
        <span>Notifications</span>
        <span 
          onClick={handleMarkAllRead} 
          style={{ color: 'var(--color-accent)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)' }}
        >
          Mark all read
        </span>
      </div>
      {isLoading ? (
        <div style={{ padding: 'var(--space-md)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
          Loading...
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ padding: 'var(--space-md)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
          No notifications yet.
        </div>
      ) : (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {notifications.map((notif) => {
            const isUnread = !notif.read && !notif.isRead;
            return (
              <div
                key={notif._id || notif.id}
                className={`${styles.notifItem} ${isUnread ? styles.notifUnread : ''}`}
                onClick={() => handleItemClick(notif)}
              >
                <div className={styles.notifContent}>
                  <div className={styles.notifTitle} style={{ fontWeight: isUnread ? 'var(--font-black)' : 'var(--font-semibold)' }}>
                    {notif.title || notif.type?.replace(/_/g, ' ').toUpperCase() || 'NOTIFICATION'}
                  </div>
                  <div className={styles.notifMessage}>{notif.message}</div>
                </div>
                <span className={styles.notifTime}>{timeAgo(notif.createdAt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
