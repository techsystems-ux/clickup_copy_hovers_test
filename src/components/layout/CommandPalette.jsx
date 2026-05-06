import React, { useState, useEffect } from 'react';
import { Search, Clock, FileText, Settings, User } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { state } = useStore();
  const { setSelectedTaskId } = useUI();

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(o => !o);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const filteredTasks = query.length > 0 
    ? state.tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
    : state.tasks.slice(0, 5); // show recent

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', paddingTop: '10vh' }} onClick={() => setIsOpen(false)}>
      <div 
        style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '60vh', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--color-border)', gap: '16px' }}>
          <Search size={20} color="var(--color-text-muted)" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search tasks, docs, people (Cmd+K)..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: '18px', outline: 'none' }} 
          />
          <div style={{ fontSize: '12px', padding: '2px 6px', backgroundColor: 'var(--color-surface-2)', borderRadius: '4px', color: 'var(--color-text-muted)' }}>ESC</div>
        </div>

        <div style={{ padding: '12px', overflowY: 'auto' }} className="custom-scrollbar">
          {query === '' && <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-muted)', marginBottom: '8px', paddingLeft: '12px' }}>RECENT TASKS</div>}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredTasks.map((t, index) => (
              <div 
                key={t.id} 
                onClick={() => { setSelectedTaskId(t.id); setIsOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: index === 0 && query !== '' ? 'rgba(178, 15, 0, 0.1)' : 'transparent', borderLeft: index === 0 && query !== '' ? '3px solid var(--color-accent)' : '3px solid transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index === 0 && query !== '' ? 'rgba(178, 15, 0, 0.1)' : 'transparent'}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={16} color="var(--color-text-muted)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{t.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Workspace {'>'} Engineering</div>
                </div>
              </div>
            ))}
          </div>

          {!query && (
            <>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-muted)', margin: '24px 0 8px', paddingLeft: '12px' }}>QUICK ACTIONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <FileText size={16} color="var(--color-text-muted)" /> <span style={{ fontSize: '14px' }}>Create new Doc</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <User size={16} color="var(--color-text-muted)" /> <span style={{ fontSize: '14px' }}>Invite Team Member</span>
                </div>
              </div>
            </>
          )}

          {query && filteredTasks.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
