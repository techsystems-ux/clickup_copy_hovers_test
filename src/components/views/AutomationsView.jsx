import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

export default function AutomationsView() {
  return (
    <div style={{ padding: '40px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Zap size={28} color="var(--color-accent)"/> Automations
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Build visual rules to save time across your Space.</p>
        </div>
        <button style={{ backgroundColor: 'var(--color-accent)', padding: '0 24px', borderRadius: '8px', fontWeight: 'bold', color: 'white' }}>+ Add Automation</button>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '32px' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '18px', color: 'var(--color-text-muted)' }}>Active Rules (1)</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
          
          <div style={{ flex: 1, backgroundColor: 'var(--color-surface-2)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>WHEN</div>
            <div style={{ fontSize: '15px', fontWeight: '500' }}>Status changes to <strong style={{color: 'var(--color-success)'}}>Done</strong></div>
          </div>

          <ArrowRight size={24} color="var(--color-text-muted)" />
          
          <div style={{ flex: 1, backgroundColor: 'var(--color-surface-2)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--color-info)' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>AND</div>
            <div style={{ fontSize: '15px', fontWeight: '500' }}>Assignee is <strong style={{color: 'var(--color-text)'}}>Alice Smith</strong></div>
          </div>

          <ArrowRight size={24} color="var(--color-text-muted)" />

          <div style={{ flex: 1, backgroundColor: 'var(--color-surface-2)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--color-accent)' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>THEN</div>
            <div style={{ fontSize: '15px', fontWeight: '500' }}>Notify <strong style={{color: 'var(--color-text)'}}>#engineering-channel</strong> in Slack</div>
          </div>

          <div style={{ padding: '0 16px' }}>
            <div style={{ width: '40px', height: '20px', backgroundColor: 'var(--color-accent)', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
