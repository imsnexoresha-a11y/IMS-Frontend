import { useUIContext } from '../../context/UIContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './Layout.module.css';

export default function AppShell({ children, title = '' }) {
  const { sidebarOpen } = useUIContext();

  return (
    <div className={styles.shell}>
      <div className={`${styles.sidebarArea} ${!sidebarOpen ? styles.sidebarCollapsed : ''}`}>
        <Sidebar />
      </div>
      <div className={styles.mainArea}>
        <Topbar title={title} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
