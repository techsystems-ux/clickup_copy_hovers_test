import React from 'react';
import { useStore } from '../../store/StoreContext';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { useUI } from '../../store/UIContext';
import './CalendarView.css';

export default function CalendarView() {
  const { state } = useStore();
  const { setSelectedTaskId } = useUI();
  
  // Basic implementation of a monthly calendar
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="calendar-view custom-scrollbar">
      <div className="calendar-header">
        <h2>{format(today, 'MMMM yyyy')}</h2>
        <div className="calendar-controls">
          <button className="btn-outline">Today</button>
          <div className="btn-group">
            <button>&lt;</button>
            <button>&gt;</button>
          </div>
        </div>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        
        {calendarDays.map(day => {
          const isCurrentMonth = day.getMonth() === today.getMonth();
          const dayTasks = state.tasks.filter(t => new Date(t.dueDate).toDateString() === day.toDateString());
          
          return (
            <div 
              key={day.toISOString()} 
              className={`calendar-cell ${!isCurrentMonth ? 'inactive-month' : ''} ${isToday(day) ? 'today' : ''}`}
            >
              <div className="cell-date">{format(day, 'd')}</div>
              {dayTasks.length > 0 && (
                <div className="cell-tasks custom-scrollbar">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`cal-task-chip ${task.status === 'Done' ? 'done' : ''}`}
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <span className={`cal-priority ${task.priority.toLowerCase()}`}></span>
                      <span className="cal-title">{task.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
