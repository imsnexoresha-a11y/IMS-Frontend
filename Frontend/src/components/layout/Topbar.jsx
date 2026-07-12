import { useState } from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import RoleBadge from './RoleBadge';
import NotificationDropdown from './NotificationDropdown';
import LogoutConfirm from './LogoutConfirm';
import RoleSwitcher from './RoleSwitcher';
import styles from './Layout.module.css';

import { useNotifications } from '../../hooks/useNotifications';

export default function Topbar({ title }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Fetch notifications to calculate dynamic unreadCount
  const { data: notificationsData } = useNotifications(user?.id);
  const notifications = Array.isArray(notificationsData) 
    ? notificationsData 
    : (notificationsData?.data?.notifications || notificationsData?.notifications || (Array.isArray(notificationsData?.data) ? notificationsData.data : []));
  const unreadCount = notifications.filter(n => !n.read && !n.isRead).length;

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <RoleSwitcher />

        <div style={{ position: 'relative' }}>
          <button
            className={styles.notifButton}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className={styles.notifBadge}>{unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <div
            className={styles.userMenu}
            onClick={() => setShowLogout(!showLogout)}
            style={{ cursor: 'pointer' }}
          >
            <Avatar
              name={user?.name}
              src={user?.avatar ? (user.avatar.startsWith('http') || user.avatar.startsWith('data:') ? user.avatar : `http://localhost:4000/${user.avatar}`) : null}
              size="sm"
            />
            <span className={styles.userName}>{user?.name}</span>
            <RoleBadge role={role} />
          </div>

          {showLogout && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: 'var(--color-surface)',
              border: '2px solid var(--color-neutral)',
              boxShadow: 'var(--shadow-offset)',
              zIndex: 100,
              minWidth: '160px',
              display: 'flex',
              flexDirection: 'column',
              padding: 'var(--space-xxs)'
            }}>
              <button
                onClick={() => {
                  setShowLogout(false);
                  navigate(`/${role}/profile`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: 'var(--space-xs) var(--space-sm)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-xs)',
                  width: '100%'
                }}
              >
                👤 View Profile
              </button>
              <button
                onClick={() => {
                  setShowLogout(false);
                  setShowLogoutConfirm(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: 'var(--space-xs) var(--space-sm)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-danger)',
                  width: '100%',
                  borderTop: '1px solid var(--border-color)'
                }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      <LogoutConfirm 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }} 
      />
    </header>
  );
}
