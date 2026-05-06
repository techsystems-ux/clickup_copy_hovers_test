import React from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import { Check, Plus } from 'lucide-react';

export default function TableView() {
  const { state } = useStore();
  const { setSelectedTaskId, activeSpaceId, activeListId } = useUI();
  const { tasks, members } = state;

  const filteredTasks = tasks.filter(t => {
    if (activeListId) return t.listId === activeListId;
    const spaceLists = state.lists.filter(l => l.spaceId === activeSpaceId).map(l => l.id);
    return spaceLists.includes(t.listId);
  });

  const columns = [
    { key: 'title', label: 'Name', width: '300px' },
    { key: 'status', label: 'Status', width: '150px' },
    { key: 'assignees', label: 'Assignees', width: '150px' },
    { key: 'dueDate', label: 'Due Date', width: '150px' },
    { key: 'priority', label: 'Priority', width: '120px' },
    { key: 'tags', label: 'Tags', width: '200px' },
  ];

  const renderCell = (task, colKey) => {
    switch(colKey) {
      case 'title':
        return <div style={{ fontWeight: 500 }}>{task.title}</div>;
      case 'status':
        return (
          <div style={{ padding: '4px 8px', backgroundColor: 'var(--color-surface-2)', borderRadius: '4px', fontSize: '12px', display: 'inline-block' }}>
            {task.status}
          </div>
        );
      case 'assignees':
        return (
          <div style={{ display: 'flex', gap: '4px' }}>
            {task.assignees.map(aId => {
              const m = members.find(mbr => mbr.id === aId);
              return m ? <img key={m.id} src={m.avatar} alt="Avatar" style={{ width: '20px', height: '20px', borderRadius: '50%' }} /> : null;
            })}
          </div>
        );
      case 'dueDate':
        return <div style={{ fontSize: '13px' }}>{new Date(task.dueDate).toLocaleDateString()}</div>;
      case 'priority':
        return <div style={{ fontSize: '13px', color: task.priority === 'Urgent' ? 'var(--color-accent)' : 'inherit' }}>{task.priority}</div>;
      case 'tags':
        return (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {task.tags.map(tag => (
              <span key={tag} style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>{tag}</span>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflowX: 'auto', overflowY: 'auto' }} className="custom-scrollbar">
        <div style={{ minWidth: '1070px', borderBottom: '1px solid var(--color-border)' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ width: '50px', padding: '12px', flexShrink: 0, borderRight: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input type="checkbox" style={{ accentColor: 'var(--color-accent)' }} />
            </div>
            {columns.map(c => (
              <div key={c.key} style={{ width: c.width, padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', flexShrink: 0, borderRight: '1px solid var(--color-border)' }}>
                {c.label}
              </div>
            ))}
            <div style={{ width: '50px', padding: '12px', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={16} color="var(--color-text-muted)" />
            </div>
          </div>

          {/* Data Rows */}
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', transition: 'background-color 0.1s ease', backgroundColor: 'var(--color-bg)' }}
              onClick={() => setSelectedTaskId(task.id)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
            >
              <div style={{ width: '50px', padding: '12px', flexShrink: 0, borderRight: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                <input type="checkbox" style={{ accentColor: 'var(--color-accent)' }} />
              </div>
              {columns.map(c => (
                <div key={c.key} style={{ width: c.width, padding: '12px 16px', flexShrink: 0, borderRight: '1px solid var(--color-border)', display: 'flex', alignItems: 'center' }}>
                  {renderCell(task, c.key)}
                </div>
              ))}
              <div style={{ width: '50px', padding: '12px', flexShrink: 0 }}></div>
            </div>
          ))}

          {/* New Task Row Placeholder */}
          <div style={{ display: 'flex', opacity: 0.5 }}>
            <div style={{ width: '50px', padding: '12px', flexShrink: 0, borderRight: '1px solid var(--color-border)'}}></div>
            <div style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--color-text-muted)' }}>+ Add new task</div>
          </div>
        </div>
      </div>
    </div>
  );
}
