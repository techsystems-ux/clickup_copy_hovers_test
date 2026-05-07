import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import { Search, BookOpen, FileText, Zap, Shield, Users, Megaphone, ChevronRight, Check, X, Type } from 'lucide-react';
import { BRAND_GUIDELINES } from '../../store/MockData';
import './KnowledgeBaseView.css';

// ─── Agency-relevant articles for manager view ───────────────────────────────
const ARTICLES = [
  {
    id: 'k1', category: 'Getting Started', icon: Zap,
    articles: [
      { id: 'a1', title: 'Welcome to Hovers Agency workspace', reads: 142, updated: '2 days ago' },
      { id: 'a2', title: 'Setting up your profile',             reads: 98,  updated: '1 week ago' },
      { id: 'a3', title: 'Navigating the dashboard',           reads: 76,  updated: '3 days ago' },
    ]
  },
  {
    id: 'k2', category: 'Tasks & Projects', icon: FileText,
    articles: [
      { id: 'a4', title: 'Creating and assigning tasks',     reads: 210, updated: 'Yesterday'  },
      { id: 'a5', title: 'Board and list view guide',        reads: 155, updated: '4 days ago' },
      { id: 'a6', title: 'Priority and status definitions',  reads: 88,  updated: '1 week ago' },
      { id: 'a7', title: 'Time tracking for creatives',      reads: 63,  updated: '5 days ago' },
    ]
  },
  {
    id: 'k3', category: 'Team Management', icon: Users,
    articles: [
      { id: 'a8',  title: 'Managing roles and permissions', reads: 64, updated: '5 days ago'  },
      { id: 'a9',  title: 'Inviting new team members',      reads: 51, updated: '2 weeks ago' },
      { id: 'a10', title: 'Setting availability statuses',  reads: 38, updated: '1 week ago'  },
    ]
  },
  {
    id: 'k4', category: 'Campaign Operations', icon: Megaphone,
    articles: [
      { id: 'a11', title: 'Campaign briefing template',           reads: 180, updated: '3 days ago' },
      { id: 'a12', title: 'Creative review & approval workflow',  reads: 130, updated: '1 week ago' },
      { id: 'a13', title: 'Deliverables handoff checklist',       reads: 95,  updated: '4 days ago' },
    ]
  },
  {
    id: 'k5', category: 'Compliance & Access', icon: Shield,
    articles: [
      { id: 'a14', title: 'Data handling and privacy policy', reads: 39, updated: '1 week ago'  },
      { id: 'a15', title: 'Client asset storage guidelines',  reads: 27, updated: '3 weeks ago' },
    ]
  },
];

// ─── Manager knowledge base ──────────────────────────────────────────────────
function ManagerKnowledgeBase() {
  const [query, setQuery] = useState('');

  const filtered = ARTICLES.map(cat => ({
    ...cat,
    articles: cat.articles.filter(a =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      cat.category.toLowerCase().includes(query.toLowerCase())
    )
  })).filter(cat => cat.articles.length > 0);

  const totalArticles = ARTICLES.reduce((s, c) => s + c.articles.length, 0);

  return (
    <div className="kb-view">
      <div className="kb-header">
        <div className="kb-header-icon"><BookOpen size={28} /></div>
        <div>
          <h2 className="kb-title">Knowledge Base</h2>
          <p className="kb-sub">{totalArticles} articles across {ARTICLES.length} categories</p>
        </div>
      </div>

      <div className="kb-search-wrap">
        <Search size={16} />
        <input
          className="kb-search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles and categories…"
        />
      </div>

      <div className="kb-categories">
        {filtered.map(cat => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="kb-category">
              <div className="kb-cat-header">
                <div className="kb-cat-icon"><Icon size={16} /></div>
                <span className="kb-cat-name">{cat.category}</span>
                <span className="kb-cat-count">{cat.articles.length}</span>
              </div>
              <div className="kb-articles">
                {cat.articles.map(article => (
                  <div key={article.id} className="kb-article-row">
                    <div className="kb-article-info">
                      <FileText size={13} style={{ flexShrink: 0, color: 'var(--color-text-muted)' }} />
                      <span className="kb-article-title">{article.title}</span>
                    </div>
                    <div className="kb-article-meta">
                      <span className="kb-article-reads">{article.reads} reads</span>
                      <span className="kb-article-updated">{article.updated}</span>
                      <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="kb-empty">
            <BookOpen size={36} style={{ opacity: 0.2 }} />
            <p>No articles match "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Color swatch ────────────────────────────────────────────────────────────
function ColorSwatch({ name, hex }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 80px', minWidth: '80px' }}>
      <div style={{
        height: '56px',
        backgroundColor: hex,
        borderRadius: '10px',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }} />
      <div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text)' }}>{name}</div>
        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--color-text-muted)', marginTop: '1px' }}>{hex}</div>
      </div>
    </div>
  );
}

// ─── Brand guideline card ────────────────────────────────────────────────────
function BrandGuideCard({ guide }) {
  return (
    <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden' }}>

      {/* Card header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ fontSize: '30px' }}>{guide.icon}</span>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px' }}>{guide.name}</h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Brand Style Guide</p>
        </div>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Colors */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>Brand Colors</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {guide.colors.map(c => <ColorSwatch key={c.hex} name={c.name} hex={c.hex} />)}
          </div>
        </div>

        {/* Typography */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--color-text-muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Type size={12} /> Typography
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[{ label: 'Display', font: guide.fonts.display }, { label: 'Body', font: guide.fonts.body }].map(({ label, font }) => (
              <div key={label} style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>{label}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '2px' }}>{font.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{font.weight} · {font.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dos & Don'ts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px', color: '#2e7d32', marginBottom: '12px' }}>✓ Do</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {guide.dos.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(46,125,50,0.12)', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--color-text)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px', color: '#b20f00', marginBottom: '12px' }}>✗ Don't</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {guide.donts.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(178,15,0,0.10)', color: '#b20f00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <X size={11} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--color-text)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Designer knowledge base ─────────────────────────────────────────────────
function DesignerKnowledgeBase({ currentUser, state }) {
  const myTasks = state.tasks.filter(t => t.assignees?.includes(currentUser.id));

  // Find which brand spaceIds this designer has tasks in
  const mySpaceIds = new Set(
    myTasks.map(t => {
      const list = state.lists.find(l => l.id === t.listId);
      return list?.spaceId;
    }).filter(Boolean)
  );

  // Show guidelines for brands this designer works on (all if none matched)
  const guideList = Object.values(BRAND_GUIDELINES).filter(g =>
    mySpaceIds.size === 0 || mySpaceIds.has(g.spaceId)
  );

  return (
    <div className="kb-view">
      <div className="kb-header">
        <div className="kb-header-icon"><BookOpen size={28} /></div>
        <div>
          <h2 className="kb-title">Brand Guidelines</h2>
          <p className="kb-sub">Style guides for {guideList.length} brand{guideList.length !== 1 ? 's' : ''} you work on</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
        {guideList.map(guide => (
          <BrandGuideCard key={guide.spaceId} guide={guide} />
        ))}
      </div>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function KnowledgeBaseView() {
  const { state } = useStore();
  const { currentUser } = useUI();

  if (!currentUser) return null;

  const isManager = currentUser.role === 'Admin' || currentUser.role === 'Team Lead';
  return isManager
    ? <ManagerKnowledgeBase />
    : <DesignerKnowledgeBase currentUser={currentUser} state={state} />;
}
