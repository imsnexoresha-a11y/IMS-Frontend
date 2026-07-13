import { useNavigate } from 'react-router-dom';

import { useAdminDashboard } from '../../hooks/useDashboard';

import DashboardStatsGrid from '../../components/admin/DashboardStatsGrid';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

function getScorerDetails(metric) {
  const student = metric?.studentId || {};
  const user = student?.userId || {};

  return {
    id:
      metric?._id ||
      student?._id ||
      user?._id,
    name: user?.name || 'Unknown student',
    email: user?.email || '',
    score:
      metric?.totalPoints ??
      student?.totalPoints ??
      0,
  };
}

function ScoreList({
  title,
  items = [],
  emptyMessage,
}) {
  return (
    <Card title={title}>
      {items.length === 0 ? (
        <p
          style={{
            color: 'var(--color-text-secondary)',
          }}
        >
          {emptyMessage}
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
          }}
        >
          {items.map((metric, index) => {
            const scorer = getScorerDetails(metric);

            return (
              <div
                key={scorer.id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-sm)',
                  border: 'var(--border)',
                }}
              >
                <div>
                  <strong>
                    {index + 1}. {scorer.name}
                  </strong>

                  {scorer.email && (
                    <div
                      style={{
                        marginTop: '4px',
                        color:
                          'var(--color-text-secondary)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      {scorer.email}
                    </div>
                  )}
                </div>

                <strong
                  style={{
                    color: 'var(--color-accent)',
                  }}
                >
                  {scorer.score}
                </strong>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminDashboard();

  if (isLoading) {
    return <p>Loading dashboard...</p>;
  }

  if (isError) {
    return (
      <Card title="Dashboard Error">
        <p
          style={{
            color: 'var(--color-danger)',
            marginBottom: 'var(--space-md)',
          }}
        >
          {error?.message ||
            'Unable to load dashboard.'}
        </p>

        <Button
          type="button"
          variant="primary"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </Card>
    );
  }

  const stats = dashboard || {};

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xl)',
      }}
    >
      <DashboardStatsGrid stats={stats} />

      <Card title="Quick Actions">
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-md)',
            flexWrap: 'wrap',
          }}
        >
          <Button
            type="button"
            variant="primary"
            onClick={() =>
              navigate('/admin/teachers')
            }
          >
            Manage Teachers
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              navigate('/admin/students')
            }
          >
            Manage Students
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              navigate('/admin/batches')
            }
          >
            Manage Batches
          </Button>
        </div>
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-xl)',
        }}
      >
        <ScoreList
          title="Top Scorers"
          items={stats.topScorers || []}
          emptyMessage="No scoring data is available yet."
        />

        <ScoreList
          title="Bottom Scorers"
          items={stats.bottomScorers || []}
          emptyMessage="No scoring data is available yet."
        />
      </div>
    </div>
  );
}