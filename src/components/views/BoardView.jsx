import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import { Clock, MessageSquare, Paperclip, MoreHorizontal } from 'lucide-react';
import './BoardView.css';

export default function BoardView() {
  const { state, updateTaskStatus } = useStore();
  const { setSelectedTaskId, activeSpaceId, activeListId } = useUI();
  const { tasks, statuses, members } = state;

  // Filter tasks based on active space/list context
  const filteredTasks = tasks.filter(t => {
    if (activeListId) return t.listId === activeListId;
    const spaceLists = state.lists.filter(l => l.spaceId === activeSpaceId).map(l => l.id);
    return spaceLists.includes(t.listId);
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return; // Note: Same column re-ordering is skipped for this mock MVP

    updateTaskStatus(draggableId, destination.droppableId);
  };

  const renderTaskCard = (task, index) => {
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';
    
    return (
      <Draggable draggableId={task.id} index={index} key={task.id}>
        {(provided, snapshot) => (
          <div
            className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setSelectedTaskId(task.id)}
          >
            <div className="task-card-header">
              <span className={`priority-indicator ${task.priority.toLowerCase()}`}></span>
              <button className="more-btn" onClick={e => e.stopPropagation()}><MoreHorizontal size={14}/></button>
            </div>
            
            <h4 className="task-card-title">{task.title}</h4>
            
            <div className="task-card-tags">
              {task.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>

            <div className="task-card-footer">
              <div className="task-card-metrics">
                <span className={`metric date ${isOverdue ? 'overdue' : ''}`}>
                  <Clock size={12} />
                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                {task.timeEstimate > 0 && (
                  <span className="metric time">{Math.round(task.timeTracked / 60)}h / {Math.round(task.timeEstimate / 60)}h</span>
                )}
              </div>
              <div className="task-card-assignees">
                {task.assignees.map(aId => {
                  const m = members.find(m => m.id === aId);
                  return m ? <img key={m.id} src={m.avatar} alt="Avatar" className="mini-avatar" /> : null;
                })}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="board-view custom-scrollbar">
      <DragDropContext onDragEnd={onDragEnd}>
        {statuses.map(status => {
          const colTasks = filteredTasks.filter(t => t.status === status);
          
          return (
            <div className="board-column" key={status}>
              <div className="column-header">
                <div className="column-title">
                  <span className="status-dot" data-status={status}></span>
                  <span className="status-name">{status.toUpperCase()}</span>
                  <span className="task-count">{colTasks.length}</span>
                </div>
                <button className="add-task-btn">+</button>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div 
                    className={`column-content custom-scrollbar ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {colTasks.map((task, index) => renderTaskCard(task, index))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
