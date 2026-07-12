import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

export default function PerformanceChart({ data = [] }) {
  const mockData = data.length ? data : [
    { name: 'Quiz 1', score: 65 },
    { name: 'Quiz 2', score: 78 },
    { name: 'Assign 1', score: 82 },
    { name: 'Quiz 3', score: 75 },
    { name: 'Assign 2', score: 88 },
    { name: 'Quiz 4', score: 92 },
  ];

  return (
    <Card title="Performance Trend">
      <div style={{ height: '300px', width: '100%', marginTop: 'var(--space-md)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="score" stroke="var(--color-accent)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <CartesianGrid stroke="var(--color-neutral)" strokeDasharray="5 5" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} dy={10} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} dx={-10} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--color-surface)', border: '2px solid var(--color-ink)', borderRadius: 0, boxShadow: 'var(--shadow-offset)', fontWeight: 'bold' }}
              itemStyle={{ color: 'var(--color-accent)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
