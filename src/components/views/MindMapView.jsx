import React from 'react';
import { GitCommit, Search } from 'lucide-react';

export default function MindMapView() {
  return (
    <div style={{ height: '100%', overflow: 'hidden', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><GitCommit size={20}/> Mind Map</h2>
        <div style={{ padding: '6px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={14}/>
          <input type="text" placeholder="Search nodes" style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--color-text)' }} />
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Fake canvas lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <path d="M 500 300 C 600 300, 600 200, 700 200" fill="transparent" stroke="var(--color-border)" strokeWidth="2" />
          <path d="M 500 300 C 600 300, 600 400, 700 400" fill="transparent" stroke="var(--color-border)" strokeWidth="2" />
          <path d="M 700 400 C 800 400, 800 350, 900 350" fill="transparent" stroke="var(--color-border)" strokeWidth="2" />
        </svg>

        {/* Nodes */}
        <div style={{ position: 'relative', zIndex: 1, width: '1000px', height: '600px' }}>
          <div style={{ position: 'absolute', top: '270px', left: '350px', padding: '12px 24px', backgroundColor: 'var(--color-accent)', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
            Engineering Ops
          </div>
          <div style={{ position: 'absolute', top: '170px', left: '700px', padding: '12px 24px', backgroundColor: 'var(--color-surface)', border: `1px solid var(--color-border)`, borderRadius: '8px', fontSize: '14px' }}>
            Frontend Sprint
          </div>
          <div style={{ position: 'absolute', top: '370px', left: '700px', padding: '12px 24px', backgroundColor: 'var(--color-surface)', border: `1px solid var(--color-border)`, borderRadius: '8px', fontSize: '14px' }}>
            Backend Services
          </div>
          <div style={{ position: 'absolute', top: '320px', left: '900px', padding: '8px 16px', backgroundColor: 'var(--color-surface-2)', border: `1px solid var(--color-border)`, borderRadius: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Migrate to Postgres
          </div>
        </div>
      </div>
    </div>
  );
}
