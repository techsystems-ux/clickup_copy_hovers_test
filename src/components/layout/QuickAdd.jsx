import React from 'react';
import { Plus } from 'lucide-react';
import { useUI } from '../../store/UIContext';

export default function QuickAdd() {
  const { setNewTaskModalOpen } = useUI();

  return (
    <button 
    onClick={() => setNewTaskModalOpen(true)}
    style={{
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: 'var(--color-accent)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(178, 15, 0, 0.4)',
      cursor: 'pointer',
      border: 'none',
      zIndex: 90, // ensure it is underneath slideover if open (slideover is 100)
      transition: 'transform 0.2s ease, background-color 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.backgroundColor = 'var(--color-accent)';
    }}
    >
      <Plus size={28} />
    </button>
  );
}
