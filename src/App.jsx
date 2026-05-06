import React from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import SlideOver from './components/layout/SlideOver';
import CommandPalette from './components/layout/CommandPalette';
import NewTaskModal from './components/layout/NewTaskModal';
import ManagerTeamView from './components/views/ManagerTeamView';
import ExecutorDashboard from './components/views/ExecutorDashboard';
import SettingsView from './components/views/SettingsView';
import HomeView from './components/views/HomeView';
import AccountsView from './components/views/AccountsView';
import KnowledgeBaseView from './components/views/KnowledgeBaseView';
import LoginView from './components/views/LoginView';
import { useUI } from './store/UIContext';
import './App.css';

function App() {
  const { activePage, currentUser, authLoading, isNewTaskModalOpen } = useUI();

  // Supabase auth check in progress
  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '14px' }}>
        Loading…
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView />;
  }

  const isManager = currentUser.role === 'Admin' || currentUser.role === 'Manager';

  const renderView = () => {
    switch (activePage) {
      case 'Home':          return <HomeView />;
      case 'Accounts':      return <AccountsView />;
      case 'Tasks':         return isManager ? <ManagerTeamView /> : <ExecutorDashboard />;
      case 'KnowledgeBase': return <KnowledgeBaseView />;
      case 'Settings':      return <SettingsView />;
      default:              return <HomeView />;
    }
  };

  return (
    <div className="app-container">
      <CommandPalette />
      {isNewTaskModalOpen && <NewTaskModal />}
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="view-content">
          {renderView()}
        </div>
        <SlideOver />
      </div>
    </div>
  );
}

export default App;
