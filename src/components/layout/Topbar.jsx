import React from 'react';
import { useUI } from '../../store/UIContext';
import { Plus, LogOut, Settings } from 'lucide-react';
import './Topbar.css';

export default function Topbar() {
  const { activePage, setActivePage, setNewTaskModalOpen, currentUser, setCurrentUser } = useUI();

  const pageLabels = { Team: 'My Team', Settings: 'Settings' };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="breadcrumbs">
          <span className="breadcrumb-item active">{pageLabels[activePage] ?? activePage}</span>
        </div>
      </div>

      <div className="topbar-right">
        {activePage !== 'Settings' && (
          <button className="new-task-btn" onClick={() => setNewTaskModalOpen(true)}>
            <Plus size={16} />
            New Task
          </button>
        )}

        <div className="user-avatar" style={{ position: 'relative' }}>
          <img
            src={currentUser?.avatar || 'https://i.pravatar.cc/150?u=1'}
            alt="User"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const menu = document.getElementById('profile-menu');
              menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }}
          />
          <div
            id="profile-menu"
            style={{ display: 'none', position: 'absolute', top: '40px', right: '0', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', width: '200px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 999 }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'white' }}>{currentUser?.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{currentUser?.role}</div>
            </div>
            <button
              onClick={() => { setActivePage('Settings'); document.getElementById('profile-menu').style.display = 'none'; }}
              style={{ width: '100%', padding: '12px 16px', textAlign: 'left', backgroundColor: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
            >
              <Settings size={14} /> Settings
            </button>
            <button
              onClick={() => { setCurrentUser(null); document.getElementById('profile-menu').style.display = 'none'; }}
              style={{ width: '100%', padding: '12px 16px', textAlign: 'left', backgroundColor: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
