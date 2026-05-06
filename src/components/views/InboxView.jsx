import React from 'react';
import { Inbox, Check } from 'lucide-react';

export default function InboxView() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Inbox size={24} color="var(--color-info)" /> Inbox
        </h2>
        <div style={{ display: 'flex', gap: '16px', color: 'var(--color-text-muted)', fontSize: '14px', fontWeight: 500 }}>
          <span style={{ color: 'var(--color-text)', borderBottom: '2px solid var(--color-accent)', paddingBottom: '4px' }}>Important</span>
          <span>Cleared</span>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>NEW NOTIFICATIONS</span>
          <button style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14}/> Clear All</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '16px', backgroundColor: 'rgba(33, 150, 243, 0.05)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-info)', marginTop: '6px' }}></div>
            <div>
              <div style={{ fontSize: '14px', marginBottom: '4px' }}><strong>Bob Jones</strong> mentioned you in a comment.</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', padding: '12px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                 "@Alice Smith can you review the pull request for the auth flow?"
              </div>
            </div>
          </div>
          
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '16px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'transparent', marginTop: '6px' }}></div>
            <div>
              <div style={{ fontSize: '14px', marginBottom: '4px' }}><strong>Charlie Davis</strong> assigned you to <strong>Draft Newsletter Mailer</strong>.</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>2 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
