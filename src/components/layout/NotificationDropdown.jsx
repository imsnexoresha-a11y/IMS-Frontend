import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Video } from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { timeAgo } from '../../utils/formatters';
import styles from './Layout.module.css';

const MOCK_MEET_LINKS = {
  'notif-003': 'https://meet.google.com/example-meet',
};

export default function NotificationDropdown({ onClose }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: notificationsData, isLoading } = useNotifications(user?.id);
  const markReadMutation = useMarkNotificationRead(user?.id);
  const markAllReadMutation = useMarkAllNotificationsRead(user?.id);

  const rawNotifications = Array.isArray(notificationsData) 
    ? notificationsData 
    : (notificationsData?.data?.notifications || notificationsData?.notifications || (Array.isArray(notificationsData?.data) ? notificationsData.data : []));

  const notifications = rawNotifications.map((notif) => ({
    ...notif,
    meetUrl: notif.meetUrl || MOCK_MEET_LINKS[notif.id] || MOCK_MEET_LINKS[notif._id] || null,
  }));

  const unreadCount = notifications.filter(n => !n.read && !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose?.();
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

  const handleMeetClick = async (event, notif) => {
    event.stopPropagation();
    try {
      const isUnread = !notif.read && !notif.isRead;
      if (isUnread) {
        await markReadMutation.mutateAsync(notif._id || notif.id);
      }
      window.open(notif.meetUrl, '_blank', 'noopener,noreferrer');
      onClose();
    } catch (err) {
      console.error('Failed to handle meet click:', err);
    }
  };

  return (
    <div className={styles.notifDropdown} ref={ref}>
      <div className={styles.notifHeader}>
        <span>
          Notifications
          {unreadCount > 0 ? ` (${unreadCount})` : ''}
        </span>
        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          style={{
            padding: 0,
            border: 0,
            background: 'transparent',
            color: unreadCount > 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            cursor: unreadCount > 0 ? 'pointer' : 'default',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-bold)',
          }}
        >
          Mark all read
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: 'var(--space-lg)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Loading...
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ padding: 'var(--space-lg)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          No notifications available.
        </div>
      ) : (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {notifications.map((notif) => {
            const isUnread = !notif.read && !notif.isRead;
            return (
              <div
                key={notif._id || notif.id}
                className={`${styles.notifItem} ${isUnread ? styles.notifUnread : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => handleItemClick(notif)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    handleItemClick(notif);
                  }
                }}
              >
                <div className={styles.notifContent}>
                  <div className={styles.notifTitle} style={{ fontWeight: isUnread ? 'var(--font-black)' : 'var(--font-semibold)' }}>
                    {notif.title || notif.type?.replace(/_/g, ' ').toUpperCase() || 'NOTIFICATION'}
                  </div>
                  <div className={styles.notifMessage}>{notif.message}</div>
                  
                  {notif.meetUrl && (
                    <button
                      type="button"
                      onClick={(event) => handleMeetClick(event, notif)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginTop: 'var(--space-xs)',
                        padding: '5px var(--space-sm)',
                        border: '2px solid var(--border-color)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-accent)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-bold)',
                      }}
                    >
                      <Video size={14} />
                      Join Google Meet
                      <ExternalLink size={12} />
                    </button>
                  )}
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