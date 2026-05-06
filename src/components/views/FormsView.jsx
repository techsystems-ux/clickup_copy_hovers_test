import React from 'react';
import { AlignLeft, CheckSquare, Type, Calendar, Upload } from 'lucide-react';

export default function FormsView() {
  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: 'var(--color-bg)' }}>
      {/* Forms Sidebar */}
      <div style={{ width: '280px', borderRight: '1px solid var(--color-border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3>Form Elements</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-surface)', borderRadius: '6px', border: '1px solid var(--color-border)', cursor: 'grab' }}>
            <Type size={16} color="var(--color-text-muted)" /> Text Field
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-surface)', borderRadius: '6px', border: '1px solid var(--color-border)', cursor: 'grab' }}>
            <AlignLeft size={16} color="var(--color-text-muted)" /> Paragraph
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-surface)', borderRadius: '6px', border: '1px solid var(--color-border)', cursor: 'grab' }}>
            <CheckSquare size={16} color="var(--color-text-muted)" /> Checkboxes
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-surface)', borderRadius: '6px', border: '1px solid var(--color-border)', cursor: 'grab' }}>
            <Calendar size={16} color="var(--color-text-muted)" /> Date Picker
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-surface)', borderRadius: '6px', border: '1px solid var(--color-border)', cursor: 'grab' }}>
            <Upload size={16} color="var(--color-text-muted)" /> File Upload
          </div>
        </div>
      </div>

      {/* Form Canvas */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '40px' }}>
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '24px', marginBottom: '32px' }}>
            <input type="text" placeholder="Bug Report Form" style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: '28px', fontWeight: 'bold', width: '100%', marginBottom: '8px', outline: 'none' }} defaultValue="Intake Form: Bug Report" />
            <input type="text" placeholder="Form description..." style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: '15px', width: '100%', outline: 'none' }} defaultValue="Please describe the issue in detail." />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ padding: '24px', border: '1px solid var(--color-accent)', borderRadius: '8px', backgroundColor: 'rgba(178, 15, 0, 0.02)' }}>
              <input type="text" defaultValue="Task Title" style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: '15px', fontWeight: 'bold', width: '100%', marginBottom: '16px', outline: 'none' }} />
              <input type="text" disabled placeholder="Short text answer" style={{ width: '100%', padding: '12px', borderRadius: '6px', backgroundColor: 'var(--color-bg)', border: '1px dashed var(--color-border)', color: 'var(--color-text-muted)' }} />
            </div>

            <div style={{ padding: '24px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <input type="text" defaultValue="Steps to Reproduce" style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: '15px', fontWeight: 'bold', width: '100%', marginBottom: '16px', outline: 'none' }} />
              <div style={{ width: '100%', padding: '12px', borderRadius: '6px', height: '100px', backgroundColor: 'var(--color-bg)', border: '1px dashed var(--color-border)', color: 'var(--color-text-muted)' }}>Long paragraph text...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
