import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './StatCard.module.css';

export default function StatCard({
  label,
  value,
  trend,
  trendLabel,
  icon: Icon,
  accent = false,
  className = '',
}) {
  const trendDir = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  const TrendIcon = trendDir === 'up' ? TrendingUp : trendDir === 'down' ? TrendingDown : Minus;

  return (
    <div className={`${styles.statCard} ${accent ? styles.accent : ''} ${className}`}>
      {Icon && (
        <div className={styles.iconWrapper}>
          <Icon size={20} />
        </div>
      )}
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
      {trend != null && (
        <span className={`${styles.statTrend} ${styles[`trend${trendDir.charAt(0).toUpperCase() + trendDir.slice(1)}`]}`}>
          <TrendIcon size={14} />
          {trendLabel || `${Math.abs(trend)}%`}
        </span>
      )}
    </div>
  );
}
