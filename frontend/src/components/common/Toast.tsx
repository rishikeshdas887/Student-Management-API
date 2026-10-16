import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  title?: string
  message: string
  type?: 'success' | 'error' | 'info'
}

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, 4500)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div className="toast animate-fade-in" role="alert">
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {toast.type === 'error' ? (
          <AlertCircle size={18} strokeWidth={2} />
        ) : toast.type === 'success' ? (
          <CheckCircle2 size={18} strokeWidth={2} />
        ) : (
          <Info size={18} strokeWidth={2} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
            {toast.title}
          </div>
        )}
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', lineHeight: '1.4' }}>
          {toast.message}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="btn btn-subtle btn-sm btn-icon"
        style={{ padding: '2px', border: 'none' }}
        aria-label="Dismiss notification"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  )
}
