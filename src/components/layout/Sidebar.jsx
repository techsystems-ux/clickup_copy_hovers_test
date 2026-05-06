import React from 'react';
import { useUI } from '../../store/UIContext';
import { Home, Users, CheckSquare, BookOpen, Settings, ShieldCheck, Menu, ChevronDown } from 'lucide-react';
import './Sidebar.css';

function NavItem({ icon: Icon, label, isActive, isCollapsed, onClick }) {
  return (
    <div className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <Icon size={18} />
      {!isCollapsed && <span className="nav-label">{label}</span>}
    </div>
  );
}

export default function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar, activePage, setActivePage, currentUser } = useUI();
  const isAdmin = currentUser?.role === 'Admin';

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isSidebarCollapsed && (
          <div className="workspace-switcher">
            <div className="workspace-avatar">E</div>
            <span className="workspace-name">Hovers Agency</span>
            <ChevronDown size={14} />
          </div>
        )}
        <button className="collapse-btn" onClick={toggleSidebar}>
          <Menu size={18} />
        </button>
      </div>

      <div className="sidebar-scrollable">
        <div className="nav-section">
          <NavItem icon={Home}        label="Home"           isActive={activePage === 'Home'}          isCollapsed={isSidebarCollapsed} onClick={() => setActivePage('Home')} />
          <NavItem icon={Users}       label="Accounts"       isActive={activePage === 'Accounts'}      isCollapsed={isSidebarCollapsed} onClick={() => setActivePage('Accounts')} />
          <NavItem icon={CheckSquare} label="Tasks"          isActive={activePage === 'Tasks'}         isCollapsed={isSidebarCollapsed} onClick={() => setActivePage('Tasks')} />
          <NavItem icon={BookOpen}    label="Knowledge Base" isActive={activePage === 'KnowledgeBase'} isCollapsed={isSidebarCollapsed} onClick={() => setActivePage('KnowledgeBase')} />
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="nav-section">
          <NavItem icon={isAdmin ? ShieldCheck : Settings} label={isAdmin ? 'Admin' : 'Settings'} isActive={activePage === 'Settings'} isCollapsed={isSidebarCollapsed} onClick={() => setActivePage('Settings')} />
        </div>
      </div>
    </aside>
  );
}
