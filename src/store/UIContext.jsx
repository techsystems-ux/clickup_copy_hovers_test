import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView,         setActiveView]         = useState('Board');
  const [selectedTaskId,     setSelectedTaskId]     = useState(null);
  const [activeSpaceId,      setActiveSpaceId]      = useState('sp1');
  const [activeListId,       setActiveListId]       = useState(null);
  const [activePage,         setActivePage]         = useState('Home');
  const [currentUser,        setCurrentUser]        = useState(null);
  const [authLoading,        setAuthLoading]        = useState(true);
  const [isNewTaskModalOpen, setNewTaskModalOpen]   = useState(false);
  const [preSelectedAssigneeId, setPreSelectedAssigneeId] = useState(null);

  // ── Load profile for a given Supabase auth user ────────────────────────────
  const loadProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) {
      setCurrentUser({
        id:       data.id,
        name:     data.name,
        email:    data.email,
        role:     data.role,
        avatar:   data.avatar || `https://i.pravatar.cc/150?u=${data.email}`,
        status:   data.status   || 'Available',
        bio:      data.bio      || '',
        phone:    data.phone    || '',
        title:    data.title    || '',
        location: data.location || '',
      });
    }
    setAuthLoading(false);
  };

  // ── Watch auth state ───────────────────────────────────────────────────────
  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user.id);
      else               setAuthLoading(false);
    });

    // Listen for sign-in / sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadProfile(session.user.id);
      else { setCurrentUser(null); setAuthLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Sign out ───────────────────────────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setActivePage('Home');
  };

  const toggleSidebar  = () => setSidebarCollapsed(p => !p);
  const closeSlideOver = () => setSelectedTaskId(null);

  return (
    <UIContext.Provider value={{
      isSidebarCollapsed, toggleSidebar,
      activeView, setActiveView,
      selectedTaskId, setSelectedTaskId, closeSlideOver,
      activeSpaceId, setActiveSpaceId,
      activeListId,  setActiveListId,
      activePage,    setActivePage,
      currentUser,   setCurrentUser,
      authLoading,
      signOut,
      isNewTaskModalOpen, setNewTaskModalOpen,
      preSelectedAssigneeId, setPreSelectedAssigneeId,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
