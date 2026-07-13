import { NavLink, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useUIContext } from '../../context/UIContext';
import { useAuth } from '../../hooks/useAuth';
import { NAV_ITEMS } from '../../utils/constants';
import styles from './Layout.module.css';
import RoleBadge from './RoleBadge';

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIContext();
  const { role } = useAuth();
  const location = useLocation();
  const navItems = NAV_ITEMS[role] || [];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        {sidebarOpen && <span className={styles.logo}>IMS</span>}
        <button className={styles.collapseBtn} onClick={toggleSidebar} aria-label="Toggle sidebar">
          {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = LucideIcons[item.icon] || LucideIcons.Circle;
          const isActive = location.pathname === item.path ||
            (item.path !== `/${role}` && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Icon size={20} />
              {sidebarOpen && <span className={styles.navItemLabel}>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {sidebarOpen && (
        <div className={styles.sidebarFooter}>
          <RoleBadge role={role} />
        </div>
      )}
    </aside>
  );
}
