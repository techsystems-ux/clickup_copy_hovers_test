import React from 'react';
import { useUI } from '../../store/UIContext';
import { LayoutDashboard, Building2, CheckSquare, BookOpen, Settings, ShieldCheck, LogOut } from 'lucide-react';
import './Sidebar.css';

function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button className={`hv-nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

export default function Sidebar() {
  const { activePage, setActivePage, currentUser, signOut } = useUI();
  const isAdmin = currentUser?.role === 'Admin';

  const initials = (currentUser?.name || currentUser?.email || '?')
    .split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className="sidebar">
      {/* Brand mark */}
      <div className="hv-brand">
        <span className="hv-brand-name">Hovers</span>
        <span className="hv-brand-dot">.</span>
      </div>

      {/* Nav */}
      <nav className="hv-nav">
        <NavItem icon={LayoutDashboard} label="Home"           isActive={activePage === 'Home'}          onClick={() => setActivePage('Home')} />
        <NavItem icon={Building2}       label="Accounts"       isActive={activePage === 'Accounts'}      onClick={() => setActivePage('Accounts')} />
        <NavItem icon={CheckSquare}     label="Tasks"          isActive={activePage === 'Tasks'}         onClick={() => setActivePage('Tasks')} />
        <NavItem icon={BookOpen}        label="Knowledge Base" isActive={activePage === 'KnowledgeBase'} onClick={() => setActivePage('KnowledgeBase')} />
        <NavItem icon={isAdmin ? ShieldCheck : Settings} label={isAdmin ? 'Admin' : 'Settings'} isActive={activePage === 'Settings'} onClick={() => setActivePage('Settings')} />
      </nav>

      {/* User card */}
      <div className="hv-user">
        <div className="hv-user-avatar">
          {currentUser?.avatar
            ? <img src={currentUser.avatar} alt={currentUser.name} />
            : <span>{initials}</span>}
        </div>
        <div className="hv-user-info">
          <p className="hv-user-name">{currentUser?.name}</p>
          <p className="hv-user-role">{currentUser?.title || currentUser?.role}</p>
        </div>
        <button className="hv-user-logout" onClick={signOut} title="Sign out">
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
