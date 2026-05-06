import React from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import { addDays, subDays } from 'date-fns';

export default function GanttView() {
  const { state } = useStore();
  const { setSelectedTaskId, activeSpaceId, activeListId } = useUI();
  const { tasks } = state;

  const filteredTasks = tasks.filter(t => {
    if (activeListId) return t.listId === activeListId;
    const spaceLists = state.lists.filter(l => l.spaceId === activeSpaceId).map(l => l.id);
    return spaceLists.includes(t.listId);
  });

  // Calculate timeline grid (next 14 days)
  const today = new Date();
  const days = Array.from({ length: 14 }).map((_, i) => addDays(today, i - 3));

  const getTaskGridLocation = (task) => {
    const dueDate = new Date(task.dueDate);
    const startDate = subDays(dueDate, Math.max(1, Math.floor((task.timeEstimate || 240) / 120))); // Dummy start date calc

    const startIdx = days.findIndex(d => d.toDateString() === startDate.toDateString());
    const endIdx = days.findIndex(d => d.toDateString() === dueDate.toDateString());

    const s = startIdx === -1 ? 0 : startIdx;
    const e = endIdx === -1 ? (s + 2) : endIdx;
    
    return { 
      gridColumnStart: s + 2, // offset by 1 for label column
      gridColumnEnd: e + 3
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ width: '250px', flexShrink: 0, padding: '16px', fontWeight: 'bold', borderRight: '1px solid var(--color-border)' }}>
          Task Name
        </div>
        <div style={{ display: 'flex', flex: 1, minWidth: '800px' }}>
          {days.map(d => (
            <div key={d.toISOString()} style={{ 
              flex: 1, 
              padding: '16px 8px', 
              borderRight: '1px solid var(--color-border)', 
              textAlign: 'center', 
              fontSize: '12px',
              backgroundColor: d.toDateString() === today.toDateString() ? 'rgba(178, 15, 0, 0.1)' : 'transparent',
              color: d.toDateString() === today.toDateString() ? 'var(--color-accent)' : 'var(--color-text-muted)'
            }}>
              {d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
            </div>
          ))}
        </div>
      </div>

      <div className="custom-scrollbar" style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ minWidth: '1050px', display: 'flex', flexDirection: 'column' }}>
          {filteredTasks.map(task => {
            const loc = getTaskGridLocation(task);
            return (
              <div key={task.id} style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', height: '48px' }}>
                
                <div style={{ width: '250px', flexShrink: 0, padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--color-border)', fontSize: '13px', cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} onClick={() => setSelectedTaskId(task.id)}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: task.status === 'Done' ? 'var(--color-success)' : 'var(--color-info)'}}></div>
                  {task.title}
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${days.length}, 1fr)`, position: 'relative' }}>
                  {/* Grid Lines */}
                  {days.map((_, i) => (
                    <div key={i} style={{ borderRight: '1px dashed var(--color-border)' }}></div>
                  ))}

                  {/* Task Bar */}
                  {loc.gridColumnStart <= days.length + 1 && (
                    <div 
                      onClick={() => setSelectedTaskId(task.id)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        bottom: '8px',
                        left: `${((loc.gridColumnStart - 1) / days.length) * 100}%`,
                        width: `${((loc.gridColumnEnd - loc.gridColumnStart) / days.length) * 100}%`,
                        backgroundColor: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        borderLeft: `4px solid ${task.status === 'Done' ? 'var(--color-success)' : 'var(--color-accent)'}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 8px',
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                      }}
                    >
                      {task.timeEstimate / 60} hrs
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
