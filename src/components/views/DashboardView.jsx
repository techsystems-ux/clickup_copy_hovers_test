import React from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import { BarChart2, CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';
import './DashboardView.css';

export default function DashboardView() {
  const { state } = useStore();
  const { currentUser } = useUI();
  
  const isManager = currentUser?.role === 'Owner' || currentUser?.role === 'Admin';
  
  // Filter tasks based on role. Managers see everything, Developers see only their own.
  const relevantTasks = isManager 
    ? state.tasks 
    : state.tasks.filter(t => t.assignees.includes(currentUser.id));

  const totalTasks = relevantTasks.length;
  const doneTasks = relevantTasks.filter(t => t.status === 'Done').length;
  const inProgress = relevantTasks.filter(t => t.status === 'In Progress' || t.status === 'Review').length;
  const overdue = relevantTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Done').length;

  return (
    <div className="dashboard-view custom-scrollbar">
      <div className="dash-header">
        <h2>{isManager ? 'Global Ops Dashboard' : 'My Execution Dashboard'}</h2>
        {!isManager && <div style={{ padding: '6px 12px', backgroundColor: 'var(--color-surface-2)', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={14}/> {currentUser.name}</div>}
        {isManager && <button className="btn-accent" onClick={() => alert('Add Widget modal coming in Phase 6!')}>Add Widget</button>}
      </div>

      <div className="dash-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon default"><BarChart2 size={24} /></div>
          <div className="kpi-data">
            <span className="kpi-value">{totalTasks}</span>
            <span className="kpi-label">{isManager ? 'Total Tasks' : 'My Assigned Tasks'}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon complete"><CheckCircle size={24} /></div>
          <div className="kpi-data">
            <span className="kpi-value">{doneTasks}</span>
            <span className="kpi-label">Completed</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon active"><Clock size={24} /></div>
          <div className="kpi-data">
            <span className="kpi-value">{inProgress}</span>
            <span className="kpi-label">In Progress</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon overdue"><AlertTriangle size={24} /></div>
          <div className="kpi-data">
            <span className="kpi-value">{overdue}</span>
            <span className="kpi-label">Overdue</span>
          </div>
        </div>
      </div>

      <div className="dash-charts-grid">
        <div className="chart-card">
          <h3>{isManager ? 'Workspace Velocity (Mock)' : 'Personal Output Logs'}</h3>
          <div className="mock-velocity-chart">
            {isManager ? (
              <svg viewBox="0 0 100 50" className="mock-svg">
                <polyline points="0,40 20,30 40,35 60,15 80,20 100,5" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
                <polyline points="0,45 20,40 40,40 60,35 80,30 100,25" fill="none" stroke="var(--color-text-muted)" strokeWidth="1" strokeDasharray="2,2" />
              </svg>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', justifyContent: 'center' }}>
                 {relevantTasks.slice(0,4).map(t => (
                   <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: 'var(--color-bg)', borderRadius: '6px', fontSize: '13px' }}>
                     <span>{t.title}</span>
                     <span style={{ color: 'var(--color-info)' }}>{Math.round(t.timeTracked / 60)} hrs tracked</span>
                   </div>
                 ))}
                 {relevantTasks.length === 0 && <div style={{ color: 'var(--color-text-muted)' }}>No tasks assigned.</div>}
              </div>
            )}
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Priority Distribution</h3>
          <div className="mock-donut-chart-container">
            <div className="mock-donut"></div>
            <div className="mock-donut-legend">
              <div className="legend-item"><span className="dot urgent"></span> Urgent</div>
              <div className="legend-item"><span className="dot high"></span> High</div>
              <div className="legend-item"><span className="dot normal"></span> Normal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
