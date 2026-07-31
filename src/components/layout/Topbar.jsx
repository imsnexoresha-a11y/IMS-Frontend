import { useState } from 'react';
import {
  Bell,
  LogOut,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

import Avatar from '../common/Avatar';
import RoleBadge from './RoleBadge';
import NotificationDropdown from './NotificationDropdown';


import styles from './Layout.module.css';

function getProfilePath(role) {
  switch (String(role || '').toLowerCase()) {
    case 'teacher':
    case 'instructor':
      return '/teacher/profile';

    case 'student':
      return '/student/profile';

    case 'admin':
      return '/admin';

    default:
      return '/';
  }
}

function getAvatarUrl(avatar) {
  if (!avatar) {
    return null;
  }

  if (
    avatar.startsWith('http://') ||
    avatar.startsWith('https://')
  ) {
    return avatar;
  }

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:4000/api/v1';

  const serverBaseUrl = apiBaseUrl.replace(
    /\/api\/v1\/?$/,
    ''
  );

  return avatar && typeof avatar === 'string' ? `${serverBaseUrl}/${avatar.replace(/^\/+/, '')}` : '';
}

export default function Topbar({ title }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showUserMenu, setShowUserMenu] =
    useState(false);

  const {
    data: notificationsData,
  } = useNotifications(user?.id || user?._id);

  const notifications = Array.isArray(
    notificationsData
  )
    ? notificationsData
    : notificationsData?.data?.notifications ||
    notificationsData?.notifications ||
    (Array.isArray(notificationsData?.data)
      ? notificationsData.data
      : []);

  const unreadCount = notifications.filter(
    (notification) =>
      notification?.read !== true &&
      notification?.isRead !== true
  ).length;

  const handleProfileNavigation = () => {
    setShowUserMenu(false);

    navigate(getProfilePath(role));
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    setShowNotifications(false);

    await logout();

    navigate('/login', {
      replace: true,
    });
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <h1 className={styles.pageTitle}>
          {title}
        </h1>
      </div>

      <div
        className={styles.topbarRight}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
        }}
      >

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.notifButton}
            onClick={() => {
              setShowNotifications(
                (currentValue) => !currentValue
              );

              setShowUserMenu(false);
            }}
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={18} />

            {unreadCount > 0 && (
              <span className={styles.notifBadge}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationDropdown
              onClose={() =>
                setShowNotifications(false)
              }
            />
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.userMenu}
            onClick={() => {
              setShowUserMenu(
                (currentValue) => !currentValue
              );

              setShowNotifications(false);
            }}
            style={{
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
            }}
            aria-label="Open user menu"
            aria-expanded={showUserMenu}
          >
            <Avatar
              name={user?.name}
              src={getAvatarUrl(
                user?.avatar ||
                user?.profileImage
              )}
              size="sm"
            />

            <span className={styles.userName}>
              {user?.name || 'User'}
            </span>

            <RoleBadge role={role} />
          </button>

          {showUserMenu && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: 'var(--color-surface)',
                border: '2px solid var(--color-neutral)',
                boxShadow: 'var(--shadow-offset)',
                zIndex: 100,
                minWidth: '180px',
                display: 'flex',
                flexDirection: 'column',
                padding: 'var(--space-xxs)',
              }}
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleProfileNavigation}
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
                  width: '100%',
                }}
              >
                <User size={14} />
                {role === 'admin' ? 'Admin Dashboard' : 'View Profile'}
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: 'var(--space-xs) var(--space-sm)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderTop: '1px solid var(--border-color)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-danger)',
                  width: '100%',
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}