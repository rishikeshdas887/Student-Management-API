import React from 'react'
import { Modal } from '../common/Modal'
import type { Student } from '../../types/student'
import { Edit2, Trash2, Mail, Phone, Calendar, BookOpen, MapPin, Hash, UserCheck } from 'lucide-react'

interface StudentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  student: Student | null
  onEdit: (student: Student) => void
  onDelete: (student: Student) => void
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  onEdit,
  onDelete,
}) => {
  if (!student) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Record Profile"
      maxWidth="540px"
      footer={
        <>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              onClose()
              onDelete(student)
            }}
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
          <div style={{ flex: 1 }} />
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              onClose()
              onEdit(student)
            }}
          >
            <Edit2 size={14} />
            <span>Edit Profile</span>
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Profile Card Summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-subtle)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              border: '1.5px solid var(--color-border-dark)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--color-text-primary)',
            }}
          >
            {student.full_name ? student.full_name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{student.full_name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
              <span className="badge font-mono" style={{ padding: '0.1rem 0.4rem' }}>
                {student.student_id}
              </span>
              {student.course && (
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  {student.course}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Fields Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0.75rem',
            fontSize: '0.84rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 0.75rem',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
              <Hash size={15} /> Student ID
            </span>
            <span className="font-mono" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {student.student_id}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 0.75rem',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
              <Calendar size={15} /> Date of Birth
            </span>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {student.date_of_birth}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 0.75rem',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
              <Mail size={15} /> Email Contact
            </span>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {student.email || <em style={{ color: 'var(--color-text-muted)' }}>Not provided</em>}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 0.75rem',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
              <Phone size={15} /> Phone Contact
            </span>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {student.phone || <em style={{ color: 'var(--color-text-muted)' }}>Not provided</em>}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 0.75rem',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
              <BookOpen size={15} /> Course
            </span>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {student.course || <em style={{ color: 'var(--color-text-muted)' }}>Not assigned</em>}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 0.75rem',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
              <UserCheck size={15} /> Enrollment Date
            </span>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {student.enrollment_date || <em style={{ color: 'var(--color-text-muted)' }}>Not recorded</em>}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '0.625rem 0.75rem',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
              <MapPin size={15} /> Address
            </span>
            <span
              style={{
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                maxWidth: '60%',
                textAlign: 'right',
              }}
            >
              {student.address || <em style={{ color: 'var(--color-text-muted)' }}>Not recorded</em>}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
