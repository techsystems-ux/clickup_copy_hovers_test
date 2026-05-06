import React from 'react';
import { Users } from 'lucide-react';
import { useStore } from '../../store/StoreContext';

export default function WorkloadView() {
  const { state } = useStore();
  const members = state.members;

  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={20}/> Workload Breakdown</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>Capacity planning based on estimated task hours.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {members.map(member => {
          const userTasks = state.tasks.filter(t => t.assignees.includes(member.id));
          const totalHours = userTasks.reduce((sum, t) => sum + (t.timeEstimate || 0) / 60, 0);
          const capacity = 40; // 40 hours a week
          const pct = Math.min((totalHours / capacity) * 100, 100);

          return (
            <div key={member.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ width: '250px', display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid var(--color-border)', paddingRight: '16px' }}>
                <img src={member.avatar} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>{member.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{totalHours} / {capacity} hrs</div>
                </div>
              </div>
              
              <div style={{ flex: 1, paddingLeft: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--color-surface-2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: pct > 80 ? 'var(--color-accent)' : 'var(--color-success)' }}></div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: pct > 80 ? 'var(--color-accent)' : 'var(--color-success)', width: '40px' }}>
                  {Math.round(pct)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
