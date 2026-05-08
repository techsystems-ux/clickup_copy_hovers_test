import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import {
  Search, BookOpen, FileText, ChevronDown, ChevronRight, ChevronUp,
  X, ArrowLeft, Clock, Hash, Filter, LayoutGrid, Check,
  Type,
} from 'lucide-react';
import { BRAND_GUIDELINES } from '../../store/MockData';
import { KB_TOPICS, getAllPosts, getAllTags } from '../../store/kb-data';
import './KnowledgeBaseView.css';

function cls(...args) { return args.filter(Boolean).join(' '); }

// ─── Markdown renderer (ports hovers-os renderMarkdown) ──────────────────────
function renderMarkdown(content) {
  const lines = content.split('\n');
  const elements = [];

  lines.forEach((line, i) => {
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="kb-md-h1">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="kb-md-h2">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="kb-md-h3">{line.slice(4)}</h3>);
    } else if (line.startsWith('- [ ] ')) {
      elements.push(
        <label key={i} className="kb-md-checkbox">
          <input type="checkbox" />
          <span>{line.slice(6)}</span>
        </label>
      );
    } else if (line.startsWith('- [x] ')) {
      elements.push(
        <label key={i} className="kb-md-checkbox done">
          <input type="checkbox" defaultChecked readOnly />
          <span>{line.slice(6)}</span>
        </label>
      );
    } else if (line.startsWith('- ')) {
      elements.push(<li key={i} className="kb-md-li">{renderInline(line.slice(2))}</li>);
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={i} className="kb-md-quote">{line.slice(2)}</blockquote>);
    } else if (line.startsWith('|')) {
      if (i === 0 || !lines[i - 1]?.startsWith('|')) {
        const tableLines = [];
        let j = i;
        while (j < lines.length && lines[j].startsWith('|')) {
          tableLines.push(lines[j]);
          j++;
        }
        elements.push(renderTable(tableLines, i));
      }
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="kb-md-spacer" />);
    } else if (line.trim() === '---') {
      elements.push(<hr key={i} className="kb-md-hr" />);
    } else {
      elements.push(<p key={i} className="kb-md-p">{renderInline(line)}</p>);
    }
  });

  return <div>{elements}</div>;
}

function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="kb-md-strong">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="kb-md-code">{part.slice(1, -1)}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}

function renderTable(lines, keyBase) {
  const rows = lines
    .filter(l => !l.match(/^\|[\s\-|]+\|$/))
    .map(l => l.split('|').filter(Boolean).map(cell => cell.trim()));

  if (rows.length === 0) return null;
  const header = rows[0];
  const body = rows.slice(1);

  return (
    <div key={keyBase} className="kb-md-table-wrap">
      <table className="kb-md-table">
        <thead>
          <tr>{header.map((cell, i) => <th key={i}>{cell}</th>)}</tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{renderInline(cell)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Full KB — Content Map + Article views (Admin, Team Lead, Executive) ────
function FullKnowledgeBase() {
  const [view, setView] = useState('content-map');
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [collapsedTopics, setCollapsedTopics] = useState(() => new Set());
  const [collapsedSections, setCollapsedSections] = useState(() => new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => new Set());
  const [activeTopicFilter, setActiveTopicFilter] = useState(null);
  const [activeTagFilter, setActiveTagFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const allPosts = useMemo(() => getAllPosts(), []);
  const allTags = useMemo(() => getAllTags(), []);

  const searchResults = searchQuery.length > 1
    ? allPosts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.includes(searchQuery.toLowerCase())) ||
        (p.content || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  function openPost(post, topicName, topicColor, sectionTitle) {
    setSelectedPost({ ...post, topicName, topicColor, sectionTitle });
    setView('article');
    setSearchQuery('');
  }

  function toggleSection(sectionId) {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  }

  function toggleSidebarTopic(topicId) {
    setSidebarCollapsed(prev => {
      const next = new Set(prev);
      next.has(topicId) ? next.delete(topicId) : next.add(topicId);
      return next;
    });
  }

  const filteredTopics = activeTopicFilter
    ? KB_TOPICS.filter(t => t.id === activeTopicFilter)
    : KB_TOPICS;

  // ===================== ARTICLE VIEW =====================
  if (view === 'article' && selectedPost) {
    const currentTopic = KB_TOPICS.find(t => t.name === selectedPost.topicName);

    return (
      <div className="kb-shell">
        {/* Article Sidebar */}
        <aside className="kb-article-sidebar">
          <div className="kb-article-sidebar-top">
            <button
              onClick={() => { setView('content-map'); setSelectedPost(null); }}
              className="kb-back-link"
            >
              <ArrowLeft size={12} />
              Content Map
            </button>
          </div>

          <div className="kb-article-topic-strip">
            <span className="kb-topic-dot" style={{ background: selectedPost.topicColor }} />
            <span>{selectedPost.topicName}</span>
          </div>

          <nav className="kb-article-nav">
            {currentTopic?.sections.map(section => (
              <div key={section.id} className="kb-article-section">
                <div className="kb-article-section-title">{section.title}</div>
                {section.posts.map(post => (
                  <button
                    key={post.id}
                    onClick={() => openPost(post, selectedPost.topicName, selectedPost.topicColor, section.title)}
                    className={cls('kb-article-post-link', selectedPost.id === post.id && 'active')}
                  >
                    <FileText size={12} />
                    <span>{post.title}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Article body */}
        <div className="kb-article-body">
          <div className="kb-article-inner">
            <div className="kb-breadcrumb">
              <button onClick={() => { setView('content-map'); setSelectedPost(null); }}>Content Map</button>
              <ChevronRight size={10} />
              <span style={{ color: selectedPost.topicColor }} className="kb-bc-topic">{selectedPost.topicName}</span>
              <ChevronRight size={10} />
              <span className="kb-bc-section">{selectedPost.sectionTitle}</span>
            </div>

            <h1 className="kb-article-title">{selectedPost.title}</h1>

            <div className="kb-article-meta">
              <span><Clock size={11} /> {selectedPost.updatedAt}</span>
              <span>by {selectedPost.createdBy}</span>
            </div>

            <div className="kb-article-tags">
              {selectedPost.tags.map(tag => (
                <span key={tag} className="kb-tag-pill">
                  <Hash size={8} />{tag}
                </span>
              ))}
            </div>

            <hr className="kb-article-divider" />

            <div className="kb-content">
              {renderMarkdown(selectedPost.content)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===================== CONTENT MAP VIEW =====================
  return (
    <div className="kb-shell">
      {/* Left sidebar — search + topic nav */}
      <aside className="kb-content-sidebar">
        <div className="kb-content-sidebar-inner">
          <div className="kb-search-wrap">
            <Search size={13} className="kb-search-icon" />
            <input
              type="text"
              placeholder="Search or jump to…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="kb-search-input"
            />
            {searchQuery.length > 1 && searchFocused && (
              <div className="kb-search-results">
                {searchResults.length === 0 ? (
                  <div className="kb-search-empty">No results</div>
                ) : (
                  <div className="kb-search-list">
                    {searchResults.slice(0, 10).map(post => (
                      <button
                        key={post.id}
                        onClick={() => openPost(post, post.topicName, post.topicColor, post.sectionTitle)}
                        className="kb-search-row"
                      >
                        <FileText size={13} />
                        <div>
                          <p className="kb-search-title">{post.title}</p>
                          <p className="kb-search-path">
                            <span className="kb-topic-dot" style={{ background: post.topicColor }} />
                            {post.topicName} › {post.sectionTitle}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => { setView('content-map'); setActiveTopicFilter(null); }}
            className="kb-nav-link active"
          >
            <LayoutGrid size={13} />
            Content Map
          </button>

          <div className="kb-nav-section">
            <div className="kb-nav-section-title">All Topics</div>
            {KB_TOPICS.map(topic => {
              const isCollapsed = sidebarCollapsed.has(topic.id);
              return (
                <div key={topic.id}>
                  <button
                    onClick={() => toggleSidebarTopic(topic.id)}
                    className={cls('kb-nav-topic', activeTopicFilter === topic.id && 'active')}
                  >
                    <span className="kb-topic-ring" style={{ borderColor: topic.color }} />
                    <span className="kb-nav-topic-name">{topic.name}</span>
                    {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                  </button>
                  {!isCollapsed && (
                    <div className="kb-nav-section-list">
                      {topic.sections.map(section => (
                        <button
                          key={section.id}
                          className="kb-nav-section-link"
                          onClick={() => {
                            setActiveTopicFilter(topic.id);
                            document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                        >
                          {section.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main content map */}
      <div className="kb-content-main">
        <div className="kb-content-header">
          <h1 className="kb-page-title">Content Map</h1>
          <div className="kb-header-controls">
            {activeTopicFilter && (
              <button onClick={() => setActiveTopicFilter(null)} className="kb-clear-chip">
                <X size={10} /> Clear filter
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cls('kb-filter-btn', showFilters && 'active')}
            >
              <Filter size={12} /> Filter
            </button>
            <span className="kb-post-count">{allPosts.length} posts</span>
          </div>
        </div>

        {showFilters && (
          <div className="kb-tag-filters">
            <div className="kb-tag-filters-label">Filter by tag</div>
            <div className="kb-tag-filters-list">
              {activeTagFilter && (
                <button onClick={() => setActiveTagFilter(null)} className="kb-tag-clear">
                  <X size={8} /> Clear
                </button>
              )}
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTagFilter(activeTagFilter === tag ? null : tag)}
                  className={cls('kb-tag-chip', activeTagFilter === tag && 'active')}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="kb-topics-grid">
          {filteredTopics.map(topic => {
            const isCollapsed = collapsedTopics.has(topic.id);
            const filteredSections = topic.sections.map(section => ({
              ...section,
              posts: activeTagFilter
                ? section.posts.filter(p => p.tags.includes(activeTagFilter))
                : section.posts,
            })).filter(s => s.posts.length > 0);

            if (activeTagFilter && filteredSections.length === 0) return null;

            return (
              <div key={topic.id} className="kb-topic-card">
                <div
                  className="kb-topic-header"
                  style={{ background: topic.color + '10', borderBottom: `2px solid ${topic.color}` }}
                  onClick={() => {
                    const next = new Set(collapsedTopics);
                    isCollapsed ? next.delete(topic.id) : next.add(topic.id);
                    setCollapsedTopics(next);
                  }}
                >
                  <h2 style={{ color: topic.color }}>{topic.name}</h2>
                  {isCollapsed
                    ? <ChevronDown size={14} style={{ color: topic.color }} />
                    : <ChevronUp size={14} style={{ color: topic.color }} />}
                </div>

                {!isCollapsed && (
                  <div className="kb-topic-body">
                    {filteredSections.map(section => {
                      const isSectionCollapsed = collapsedSections.has(section.id);
                      return (
                        <div key={section.id} id={`section-${section.id}`} className="kb-section">
                          <button onClick={() => toggleSection(section.id)} className="kb-section-header">
                            <span className="kb-section-title">{section.title}</span>
                            <div className="kb-section-meta">
                              <span className="kb-section-count">{section.posts.length}</span>
                              {isSectionCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                            </div>
                          </button>
                          {!isSectionCollapsed && (
                            <div className="kb-section-posts">
                              {section.posts.map(post => (
                                <button
                                  key={post.id}
                                  onClick={() => openPost(post, topic.name, topic.color, section.title)}
                                  className="kb-post-link"
                                >
                                  <FileText size={12} />
                                  <span>{post.title}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Color swatch (designer view) ────────────────────────────────────────────
function ColorSwatch({ name, hex }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 80px', minWidth: '80px' }}>
      <div style={{ height: '48px', backgroundColor: hex, borderRadius: '8px', border: '1px solid var(--mid-grey)' }} />
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{name}</div>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{hex}</div>
      </div>
    </div>
  );
}

// ─── Brand guideline card (designer view) ────────────────────────────────────
function BrandGuideCard({ guide }) {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--mid-grey)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--mid-grey)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>{guide.icon}</span>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>{guide.name}</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>Brand Style Guide</p>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '12px' }}>Brand Colors</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {guide.colors.map(c => <ColorSwatch key={c.hex} name={c.name} hex={c.hex} />)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Type size={11} /> Typography
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[{ label: 'Display', font: guide.fonts.display }, { label: 'Body', font: guide.fonts.body }].map(({ label, font }) => (
              <div key={label} style={{ background: 'var(--off-white)', border: '1px solid var(--mid-grey)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{font.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{font.weight} · {font.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--status-done)', marginBottom: '10px' }}>Do</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {guide.dos.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Check size={12} style={{ color: 'var(--status-done)', flexShrink: 0, marginTop: '3px' }} />
                  <span style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '10px' }}>Don't</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {guide.donts.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <X size={12} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '3px' }} />
                  <span style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Designer KB ─────────────────────────────────────────────────────────────
function DesignerKnowledgeBase({ currentUser, state }) {
  const myTasks = state.tasks.filter(t => t.assignees?.includes(currentUser.id));
  const mySpaceIds = new Set(
    myTasks.map(t => {
      const list = state.lists.find(l => l.id === t.listId);
      return list?.spaceId;
    }).filter(Boolean)
  );
  const guideList = Object.values(BRAND_GUIDELINES).filter(g =>
    mySpaceIds.size === 0 || mySpaceIds.has(g.spaceId)
  );

  return (
    <div className="kb-designer">
      <div className="kb-designer-header">
        <div className="kb-designer-icon"><BookOpen size={22} /></div>
        <div>
          <h2 className="kb-designer-title">Brand Guidelines</h2>
          <p className="kb-designer-sub">Style guides for {guideList.length} brand{guideList.length !== 1 ? 's' : ''} you work on</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
        {guideList.map(guide => <BrandGuideCard key={guide.spaceId} guide={guide} />)}
      </div>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function KnowledgeBaseView() {
  const { state } = useStore();
  const { currentUser } = useUI();

  if (!currentUser) return null;

  // Admin, Team Lead, Executive all see the full KB; Creative Associates see Brand Guidelines.
  const canSeeFullKB = currentUser.role !== 'Creative Associate';
  return canSeeFullKB
    ? <FullKnowledgeBase />
    : <DesignerKnowledgeBase currentUser={currentUser} state={state} />;
}
