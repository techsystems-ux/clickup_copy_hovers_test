import React from 'react';

const INTEGRATIONS = [
  { id: 'slack', name: 'Slack', description: 'Send notifications to channels when tasks update.', status: 'Connected', color: '#4A154B' },
  { id: 'github', name: 'GitHub', description: 'Link pull requests to tasks and automate statuses.', status: 'Connect', color: '#24292e' },
  { id: 'figma', name: 'Figma', description: 'Preview designs directly within task details.', status: 'Connect', color: '#F24E1E' },
  { id: 'gitlab', name: 'GitLab', description: 'Sync commits and issues with GitLab repositories.', status: 'Connect', color: '#FC6D26' },
  { id: 'zoom', name: 'Zoom', description: 'Start Zoom meetings natively from any task.', status: 'Connected', color: '#2D8CFF' },
  { id: 'gdrive', name: 'Google Drive', description: 'Attach Google Drive files to your tasks directly.', status: 'Connect', color: '#1FA463' }
];

export default function IntegrationsView() {
  return (
    <div style={{ padding: '40px', height: '100%', overflowY: 'auto' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Integrations Apps</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Connect Engineering Ops to your favorite developer and design tools.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {INTEGRATIONS.map(int => (
          <div key={int.id} style={{ 
            backgroundColor: 'var(--color-surface)', 
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: int.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {int.name[0]}
              </div>
              <h3 style={{ fontSize: '18px' }}>{int.name}</h3>
            </div>
            
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', flex: 1 }}>{int.description}</p>
            
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{ 
                padding: '8px 16px', 
                borderRadius: '6px', 
                backgroundColor: int.status === 'Connected' ? 'rgba(76, 175, 80, 0.1)' : 'var(--color-surface-2)',
                color: int.status === 'Connected' ? 'var(--color-success)' : 'var(--color-text)',
                fontWeight: '600'
              }}>
                {int.status}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
