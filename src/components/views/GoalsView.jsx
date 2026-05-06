import React from 'react';
import { Target, Plus } from 'lucide-react';

export default function GoalsView() {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Target size={28} color="var(--color-success)" /> Goals
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Track OKRs and high-level objectives across targets.</p>
        </div>
        <button style={{ backgroundColor: 'var(--color-accent)', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> New Goal
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px' }}>Q3 Product Launch</h3>
            <span style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>65%</span>
          </div>
          
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ width: '65%', height: '100%', backgroundColor: 'var(--color-success)' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Target size={16} color="var(--color-text-muted)" />
              <div style={{ flex: 1, fontSize: '14px' }}>Release Frontend V2</div>
              <div style={{ width: '100px', height: '6px', backgroundColor: 'var(--color-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '80%', height: '100%', backgroundColor: 'var(--color-info)' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Target size={16} color="var(--color-text-muted)" />
              <div style={{ flex: 1, fontSize: '14px' }}>Finish Backend Migration</div>
              <div style={{ width: '100px', height: '6px', backgroundColor: 'var(--color-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '50%', height: '100%', backgroundColor: 'var(--color-warning)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
