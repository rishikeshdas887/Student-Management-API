import React from 'react'
import type { Student } from '../../types/student'
import {
  Search,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  AlertCircle,
  X,
} from 'lucide-react'
import { EmptyState } from '../common/EmptyState'

interface StudentTableProps {
  students: Student[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  onSearchChange: (value: string) => void
  courseFilter: string
  onCourseChange: (value: string) => void
  coursesList: string[]
  onRefresh: () => void
  onViewStudent: (student: Student) => void
  onEditStudent: (student: Student) => void
  onDeleteStudent: (student: Student) => void
  onOpenCreate: () => void
  page: number
  pageSize: number
  onPageChange: (newPage: number) => void
  hasMore: boolean
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  isLoading,
  error,
  searchTerm,
  onSearchChange,
  courseFilter,
  onCourseChange,
  coursesList,
  onRefresh,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onOpenCreate,
  page,
  pageSize,
  onPageChange,
  hasMore,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Control bar: Search, Course filter, Refresh */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          {/* Search by Name */}
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '360px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem', paddingRight: searchTerm ? '2rem' : '0.75rem' }}
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="btn btn-subtle btn-sm btn-icon"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '2px',
                  border: 'none',
                }}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter by Course */}
          <div style={{ position: 'relative', minWidth: '180px' }}>
            <select
              className="form-select"
              value={courseFilter}
              onChange={(e) => onCourseChange(e.target.value)}
              aria-label="Filter by academic course"
            >
              <option value="">All Courses</option>
              {coursesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters shortcut */}
          {(searchTerm || courseFilter) && (
            <button
              type="button"
              className="btn btn-subtle btn-sm"
              onClick={() => {
                onSearchChange('')
                onCourseChange('')
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Actions: Refresh & Count indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh student records from backend"
          >
            <RefreshCw size={14} className={isLoading ? 'spinner' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="form-error-banner" role="alert" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onRefresh}>
            Retry
          </button>
        </div>
      )}

      {/* Data Table */}
      <div className="table-container">
        <table className="data-table" aria-label="Students Directory">
          <thead>
            <tr>
              <th scope="col" style={{ width: '120px' }}>Student ID</th>
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Course</th>
              <th scope="col" style={{ width: '120px' }}>Date of Birth</th>
              <th scope="col" style={{ width: '120px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`loading-${idx}`}>
                  <td colSpan={7} style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span className="spinner" />
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Loading student records...
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : error ? (
              // Error State in Table
              <tr>
                <td colSpan={7} style={{ padding: 0 }}>
                  <EmptyState
                    title="Failed to Load Student Directory"
                    description={error}
                    action={{
                      label: 'Retry Connection',
                      onClick: onRefresh,
                    }}
                  />
                </td>
              </tr>
            ) : students.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7} style={{ padding: 0 }}>
                  <EmptyState
                    title={searchTerm || courseFilter ? 'No matching students' : 'No students registered'}
                    description={
                      searchTerm || courseFilter
                        ? 'No records match your active search and filter criteria. Try adjusting your query.'
                        : 'The database has no student records yet. Click below to register the first student.'
                    }
                    action={
                      searchTerm || courseFilter
                        ? {
                            label: 'Clear Filters',
                            onClick: () => {
                              onSearchChange('')
                              onCourseChange('')
                            },
                          }
                        : {
                            label: 'Add First Student',
                            onClick: onOpenCreate,
                          }
                    }
                  />
                </td>
              </tr>
            ) : (
              // Student Data Rows
              students.map((student) => (
                <tr key={student.student_id}>
                  {/* Student ID */}
                  <td>
                    <span className="badge font-mono" style={{ fontWeight: 600 }}>
                      {student.student_id}
                    </span>
                  </td>

                  {/* Full Name */}
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {student.full_name}
                    </div>
                  </td>

                  {/* Email */}
                  <td>
                    {student.email ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Mail size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                        <span>{student.email}</span>
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-subtle)' }}>—</span>
                    )}
                  </td>

                  {/* Phone */}
                  <td>
                    {student.phone ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Phone size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                        <span>{student.phone}</span>
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-subtle)' }}>—</span>
                    )}
                  </td>

                  {/* Course */}
                  <td>
                    {student.course ? (
                      <span className="badge badge-outline">
                        <BookOpen size={11} style={{ marginRight: '2px' }} />
                        {student.course}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-subtle)' }}>General</span>
                    )}
                  </td>

                  {/* Date of Birth */}
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Calendar size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                      <span>{student.date_of_birth}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <button
                        type="button"
                        className="btn btn-subtle btn-sm btn-icon"
                        onClick={() => onViewStudent(student)}
                        title="View student profile"
                        aria-label={`View profile of ${student.full_name}`}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-subtle btn-sm btn-icon"
                        onClick={() => onEditStudent(student)}
                        title="Edit student"
                        aria-label={`Edit ${student.full_name}`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-subtle btn-sm btn-icon"
                        onClick={() => onDeleteStudent(student)}
                        title="Delete student"
                        aria-label={`Delete ${student.full_name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.25rem',
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        <div>
          Showing page <strong>{page + 1}</strong> ({students.length} records shown)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0 || isLoading}
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasMore || isLoading || students.length < pageSize}
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
