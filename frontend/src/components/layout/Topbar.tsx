import React from 'react'
import { Menu, Plus, RefreshCw, Server } from 'lucide-react'
import type { HealthState } from '../../hooks/useBackendHealth'

interface TopbarProps {
  title: string
  subtitle?: string
  health: HealthState & { recheck: () => void }
  onOpenMobileMenu: () => void
  onOpenCreateModal: () => void
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  subtitle,
  health,
  onOpenMobileMenu,
  onOpenCreateModal,
}) => {
  return (
    <header
      style={{
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--color-border-subtle)',
        padding: '0 var(--space-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
      className="topbar"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="btn btn-subtle btn-sm btn-icon mobile-menu-btn"
          style={{ display: 'none' }}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {title}
          </h1>
          {subtitle && (
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Subtle black-and-grey health status indicator */}
        <div
          title={
            health.isConnected
              ? `Backend & SQLite connected (Last checked: ${health.lastChecked?.toLocaleTimeString() || 'just now'})`
              : health.isChecking
              ? 'Checking backend connection...'
              : `Backend unreachable: ${health.error || 'Server error'}`
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.65rem',
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            color: 'var(--color-text-primary)',
            fontWeight: 500,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: health.isConnected
                ? '#18181b'
                : health.isChecking
                ? '#71717a'
                : '#d4d4d8',
              border: '1px solid #18181b',
              flexShrink: 0,
            }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Server size={13} strokeWidth={1.75} />
            {health.isChecking ? (
              'Checking...'
            ) : health.isConnected ? (
              'API Online'
            ) : (
              'API Offline'
            )}
          </span>
          <button
            type="button"
            onClick={health.recheck}
            disabled={health.isChecking}
            className="btn btn-subtle btn-sm"
            style={{ padding: '2px 4px', fontSize: '0.7rem', border: 'none', marginLeft: '2px' }}
            title="Refresh API health status"
            aria-label="Refresh API health status"
          >
            <RefreshCw size={11} className={health.isChecking ? 'spinner' : ''} />
          </button>
        </div>

        {/* Quick action: Add Student */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} strokeWidth={2} />
          <span>New Student</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .topbar {
            padding: 0 var(--space-4) !important;
          }
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  )
}
