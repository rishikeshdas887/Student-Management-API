import React from 'react'
import { FolderSearch } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-default)',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        {icon || <FolderSearch size={24} strokeWidth={1.5} />}
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.375rem' }}>
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.84rem',
          color: 'var(--color-text-muted)',
          maxWidth: '380px',
          marginBottom: action ? '1.25rem' : 0,
        }}
      >
        {description}
      </p>
      {action && (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
