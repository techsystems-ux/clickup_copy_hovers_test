import React from 'react';
import { FileText, Plus, Search, MoreHorizontal } from 'lucide-react';

export default function DocsView() {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Docs Sidebar */}
      <div style={{ width: '280px', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '18px' }}>Workspace Docs</h3>
          <button style={{ color: 'var(--color-text-muted)' }}><Plus size={18} /></button>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'var(--color-surface-2)', borderRadius: '6px' }}>
            <Search size={14} className="text-muted"/>
            <input type="text" placeholder="Search docs..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: '14px', width: '100%' }} />
          </div>
        </div>
        <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: 'var(--color-text)' }}>
            <FileText size={16} color="var(--color-info)" />
            <span style={{ fontSize: '14px' }}>Engineering Onboarding</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 12px', color: 'var(--color-text-muted)' }}>
            <FileText size={16} />
            <span style={{ fontSize: '14px' }}>Q3 Goals & OKRs</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 12px', color: 'var(--color-text-muted)' }}>
            <FileText size={16} />
            <span style={{ fontSize: '14px' }}>API Architecture</span>
          </div>
        </div>
      </div>

      {/* Doc Editor Placeholder */}
      <div style={{ flex: 1, padding: '40px 80px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '8px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
            <span>Workspace</span> / <span>Engineering Onboarding</span>
          </div>
          <button style={{ color: 'var(--color-text-muted)' }}><MoreHorizontal size={18}/></button>
        </div>
        
        <h1 style={{ fontSize: '48px', marginBottom: '24px', outline: 'none' }} contentEditable suppressContentEditableWarning>
          Engineering Onboarding
        </h1>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          <img src="https://i.pravatar.cc/150?u=1" style={{ width: '24px', height: '24px', borderRadius: '50%' }} alt="" />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Created by Alice Smith • Updated 2 hrs ago</span>
        </div>

        <div style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--color-text)', outline: 'none' }} contentEditable suppressContentEditableWarning>
          <p style={{ marginBottom: '16px' }}>Welcome to the engineering team! This document contains everything you need to get started.</p>
          <h2 style={{ fontSize: '24px', margin: '32px 0 16px' }}>1. Local Setup</h2>
          <p style={{ marginBottom: '16px' }}>Ensure you have matching node versions using NVM. We use Node v18.x standard.</p>
          <pre style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', marginBottom: '16px', border: '1px solid var(--color-border)' }}>
            npm ci<br/>
            npm run dev
          </pre>
          <h2 style={{ fontSize: '24px', margin: '32px 0 16px' }}>2. Architecture Overview</h2>
          <p>We are using a Vite + React SPA architecture. Global state is managed via Context + useReducer to simulate a robust data layer.</p>
        </div>
      </div>
    </div>
  );
}
