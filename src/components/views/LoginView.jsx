import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Shield, Briefcase, Palette, Lock, Loader } from 'lucide-react';

// Quick-fill credentials — same as what the seed script creates
const QUICK_FILL = {
  admin:    { email: 'alice@hoversagency.com',   password: 'admin123'   },
  manager:  { email: 'james@hoversagency.com',   password: 'manager123' },
  exec:     { email: 'bob@hoversagency.com',     password: 'exec123'    },
  designer: { email: 'charlie@hoversagency.com', password: 'design123'  },
};

export default function LoginView() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({
      email:    email.toLowerCase().trim(),
      password,
    });
    if (authError) setError('Invalid email or password.');
    setLoading(false);
    // On success, UIContext's onAuthStateChange listener loads the profile automatically.
  };

  const autoFill = (role) => {
    const cred = QUICK_FILL[role];
    if (!cred) return;
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  const inputStyle = {
    width: '100%', padding: '12px', backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)', borderRadius: '8px',
    color: 'var(--color-text)', outline: 'none', fontSize: '14px',
  };
  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: 700,
    color: 'var(--color-text-muted)', marginBottom: '8px',
    textTransform: 'uppercase', letterSpacing: '0.6px',
  };

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#111111', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={20} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Hovers Agency</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>Sign in to your workspace</p>
      </div>

      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '32px' }}>

        {error && (
          <div style={{ backgroundColor: 'rgba(17,17,17,0.06)', color: 'var(--color-text)', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', border: '1px solid var(--color-border)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@hoversagency.com"
              style={inputStyle}
              autoComplete="email"
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{ width: '100%', padding: '12px', backgroundColor: '#111111', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (loading || !email || !password) ? 0.5 : 1, transition: 'opacity 0.2s' }}
          >
            {loading ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Lock size={15} />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Demo Quick-Fill</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { key: 'admin',    label: 'Admin',    Icon: Shield    },
              { key: 'manager',  label: 'Manager',  Icon: Briefcase },
              { key: 'exec',     label: 'Executive',Icon: Briefcase },
              { key: 'designer', label: 'Designer', Icon: Palette   },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => autoFill(key)}
                style={{ flex: 1, padding: '8px 6px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer' }}
              >
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
