import React from 'react'
import type { Student } from '../../types/student'
import { Eye, Plus, ArrowRight, UserCheck } from 'lucide-react'

interface RecentStudentsProps {
  students: Student[]
  isLoading: boolean
  onViewStudent: (student: Student) => void
  onViewAll: () => void
  onAddStudent: () => void
}

export const RecentStudents: React.FC<RecentStudentsProps> = ({
  students,
  isLoading,
  onViewStudent,
  onViewAll,
  onAddStudent,
}) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Student Registrations</h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Latest records stored in SQLite database
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onViewAll}
        >
          <span>View Directory</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div style={{ padding: '0.5rem 0' }}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <span className="spinner" style={{ marginRight: '8px' }} /> Loading recent records...
          </div>
        ) : students.length === 0 ? (
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-default)',
                backgroundColor: 'var(--color-surface-subtle)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <UserCheck size={20} strokeWidth={1.5} />
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              No student records found
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Start by registering the first student profile in the database.
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onAddStudent}
            >
              <Plus size={15} />
              <span>Register Student</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {students.slice(0, 5).map((student) => (
              <div
                key={student.student_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1.5rem',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  transition: 'background-color 0.15s ease',
                }}
                className="recent-row"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-default)',
                      backgroundColor: 'var(--color-surface-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                  >
                    {student.full_name ? student.full_name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{student.full_name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                      <span className="badge font-mono" style={{ fontSize: '0.7rem', padding: '0.05rem 0.35rem' }}>
                        {student.student_id}
                      </span>
                      {student.course && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                          {student.course}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                    {student.enrollment_date ? `Enrolled ${student.enrollment_date}` : student.date_of_birth}
                  </div>
                  <button
                    type="button"
                    className="btn btn-subtle btn-sm btn-icon"
                    onClick={() => onViewStudent(student)}
                    title="View details"
                    aria-label={`View details of ${student.full_name}`}
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .recent-row:hover {
          background-color: var(--color-surface-subtle);
        }
        .recent-row:last-child {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  )
}
