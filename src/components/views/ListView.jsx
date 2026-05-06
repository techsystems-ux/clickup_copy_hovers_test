import React from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import { Clock, PlayCircle } from 'lucide-react';
import './ListView.css';

export default function ListView() {
  const { state } = useStore();
  const { setSelectedTaskId, activeSpaceId, activeListId } = useUI();
  const { tasks, statuses, members } = state;

  const filteredTasks = tasks.filter(t => {
    if (activeListId) return t.listId === activeListId;
    const spaceLists = state.lists.filter(l => l.spaceId === activeSpaceId).map(l => l.id);
    return spaceLists.includes(t.listId);
  });

  return (
    <div className="list-view custom-scrollbar">
      {statuses.map(status => {
        const colTasks = filteredTasks.filter(t => t.status === status);
        if (colTasks.length === 0) return null;

        return (
          <div className="list-group" key={status}>
            <div className="list-group-header">
              <span className="status-badge" data-status={status}>{status}</span>
              <span className="task-count">{colTasks.length} TASKS</span>
            </div>
            
            <div className="list-table border-subtle">
              <div className="table-header">
                <div className="th-task">Task Name</div>
                <div className="th-assignee">Assignee</div>
                <div className="th-due">Due Date</div>
                <div className="th-priority">Priority</div>
                <div className="th-time">Time Tracked</div>
              </div>
              
              {colTasks.map(task => {
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';
                
                return (
                  <div className="table-row" key={task.id} onClick={() => setSelectedTaskId(task.id)}>
                    <div className="td-task">
                      <span className={`priority-color ${task.priority.toLowerCase()}`}></span>
                      <span className="task-name">{task.title}</span>
                    </div>
                    
                    <div className="td-assignee">
                      {task.assignees.map(aId => {
                        const m = members.find(mbr => mbr.id === aId);
                        return m ? <img key={m.id} src={m.avatar} alt="Avatar" title={m.name} className="list-avatar" /> : null;
                      })}
                    </div>
                    
                    <div className={`td-due ${isOverdue ? 'overdue' : ''}`}>
                      <Clock size={12} />
                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    
                    <div className="td-priority">
                      <span className={`priority-chip ${task.priority.toLowerCase()}`}>{task.priority}</span>
                    </div>
                    
                    <div className="td-time">
                      <button className="timer-btn" onClick={(e) => e.stopPropagation()}><PlayCircle size={16} /></button>
                      <span className="time-value">
                        {Math.floor(task.timeTracked / 60)}h {task.timeTracked % 60}m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
