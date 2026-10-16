import React from 'react'
import { LayoutDashboard, Users, FileCode2, ExternalLink, GraduationCap, X } from 'lucide-react'

interface SidebarProps {
  currentTab: 'dashboard' | 'students'
  onSelectTab: (tab: 'dashboard' | 'students') => void
  isOpen: boolean
  onCloseMobile: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 40,
            display: 'block',
          }}
          className="mobile-overlay"
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--color-surface-sidebar)',
          borderRight: '1px solid var(--color-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'relative',
          zIndex: 50,
          transition: 'transform 0.2s ease',
        }}
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
      >
        {/* Brand header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '1.5px solid var(--color-border-dark)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GraduationCap size={18} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--color-text-primary)' }}>
                Student Management
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                Academic Administration
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-subtle btn-sm btn-icon mobile-close-btn"
            onClick={onCloseMobile}
            style={{ display: 'none' }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation list */}
        <nav style={{ padding: '1.25rem 0.875rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button
            type="button"
            onClick={() => {
              onSelectTab('dashboard')
              onCloseMobile()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: currentTab === 'dashboard' ? '1px solid var(--color-border-dark)' : '1px solid transparent',
              backgroundColor: currentTab === 'dashboard' ? '#ffffff' : 'transparent',
              color: 'var(--color-text-primary)',
              fontWeight: currentTab === 'dashboard' ? 600 : 500,
              fontSize: '0.84rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s ease',
            }}
          >
            <LayoutDashboard size={18} strokeWidth={currentTab === 'dashboard' ? 2 : 1.75} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectTab('students')
              onCloseMobile()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: currentTab === 'students' ? '1px solid var(--color-border-dark)' : '1px solid transparent',
              backgroundColor: currentTab === 'students' ? '#ffffff' : 'transparent',
              color: 'var(--color-text-primary)',
              fontWeight: currentTab === 'students' ? 600 : 500,
              fontSize: '0.84rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Users size={18} strokeWidth={currentTab === 'students' ? 2 : 1.75} />
            <span>Students Directory</span>
          </button>

          <div
            style={{
              margin: '1rem 0 0.5rem',
              padding: '0 0.875rem',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-text-muted)',
            }}
          >
            Developer & API
          </div>

          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              fontSize: '0.84rem',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileCode2 size={18} strokeWidth={1.75} />
              <span>Swagger API Docs</span>
            </div>
            <ExternalLink size={14} color="var(--color-text-muted)" />
          </a>
        </nav>

        {/* Footer info */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-surface-sidebar)',
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 600 }}>Engine</span>
            <span style={{ color: 'var(--color-text-muted)' }}>FastAPI + SQLite</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600 }}>Architecture</span>
            <span style={{ color: 'var(--color-text-muted)' }}>Monochrome SaaS</span>
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .sidebar {
            position: fixed !important;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
          }
          .sidebar.sidebar-open {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  )
}
