import React from 'react';
import { Activity } from 'lucide-react';
import { useStore } from '../../store/StoreContext';

export default function ActivityView() {
  const { state } = useStore();
  const members = state.members;

  // Mocking 20 random activity events
  const logs = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    member: members[i % members.length],
    action: i % 3 === 0 ? 'created task' : i % 2 === 0 ? 'changed status to Done on' : 'commented on',
    target: state.tasks[i % state.tasks.length].title,
    time: `${i * 2 + 1} hours ago`
  }));

  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '32px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}><Activity size={24}/> Workspace Activity Feed</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '15px', top: '0px', bottom: '0', width: '2px', backgroundColor: 'var(--color-border)', zIndex: 0 }}></div>
          
          {logs.map(log => (
            <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative', zIndex: 1 }}>
              <div style={{ backgroundColor: 'var(--color-surface)', padding: '4px', borderRadius: '50%', border: '1px solid var(--color-border)' }}>
                <img src={log.member.avatar} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
              </div>
              
              <div style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px 16px', flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px' }}>
                  <strong>{log.member.name}</strong> {log.action} <em style={{ color: 'var(--color-text-muted)' }}>{log.target}</em>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                  {log.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
