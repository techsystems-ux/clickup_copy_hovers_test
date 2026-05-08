import React, { useState } from 'react';
import { useUI } from '../../store/UIContext';
import { Plus, Search, LogOut, Settings as SettingsIcon } from 'lucide-react';
import './Topbar.css';

const PAGE_TITLES = {
  Home:          'Home',
  Accounts:      'Accounts',
  Tasks:         'Tasks',
  KnowledgeBase: 'Knowledge Base',
  Settings:      'Settings',
};

export default function Topbar() {
  const { activePage, setActivePage, setNewTaskModalOpen, currentUser, signOut } = useUI();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const title = PAGE_TITLES[activePage] || activePage;
  const initials = (currentUser?.name || currentUser?.email || '?')
    .split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="topbar">
      <div className="hv-topbar-left">
        <h1 className="hv-page-title">{title}</h1>
      </div>

      <div className="hv-topbar-right">
        {searchOpen ? (
          <div className="hv-search-wrap">
            <Search size={14} className="hv-search-icon" />
            <input
              autoFocus
              type="text"
              placeholder="Search…"
              onBlur={() => setSearchOpen(false)}
              className="hv-search-input"
            />
          </div>
        ) : (
          <button className="hv-icon-btn" onClick={() => setSearchOpen(true)} title="Search">
            <Search size={16} />
          </button>
        )}

        {activePage !== 'Settings' && currentUser?.role !== 'Creative Associate' && (
          <button className="hv-new-task-btn" onClick={() => setNewTaskModalOpen(true)}>
            <Plus size={14} />
            New Task
          </button>
        )}

        <div className="hv-profile-wrap">
          <button className="hv-profile-trigger" onClick={() => setProfileOpen(p => !p)}>
            {currentUser?.avatar
              ? <img src={currentUser.avatar} alt={currentUser.name} />
              : <span>{initials}</span>}
          </button>

          {profileOpen && (
            <>
              <div className="hv-profile-scrim" onClick={() => setProfileOpen(false)} />
              <div className="hv-profile-menu">
                <div className="hv-profile-header">
                  <p className="hv-profile-name">{currentUser?.name}</p>
                  <p className="hv-profile-role">{currentUser?.role}</p>
                </div>
                <button
                  className="hv-profile-item"
                  onClick={() => { setActivePage('Settings'); setProfileOpen(false); }}
                >
                  <SettingsIcon size={14} /> Settings
                </button>
                <button
                  className="hv-profile-item danger"
                  onClick={() => { signOut(); setProfileOpen(false); }}
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
