import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isConfirming?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirming = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      maxWidth="440px"
      footer={
        <>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming && <span className="spinner" style={{ marginRight: '6px' }} />}
            {confirmText}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div
          style={{
            padding: '8px',
            border: '1px solid var(--color-border-dark)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertCircle size={20} strokeWidth={2} />
        </div>
        <div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  )
}
