import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type { Student } from '../types/student'
import { studentApi } from '../services/api'
import { StudentTable } from '../components/students/StudentTable'
import { StudentFormModal } from '../components/students/StudentFormModal'
import { StudentDetailModal } from '../components/students/StudentDetailModal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import type { ToastMessage } from '../components/common/Toast'
import { Plus } from 'lucide-react'

interface StudentsPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void
  onStudentsUpdated: () => void
  globalStudents: Student[]
  reloadGlobalStudents: () => Promise<void>
}

const PAGE_SIZE = 25

export const StudentsPage: React.FC<StudentsPageProps> = ({
  onAddToast,
  onStudentsUpdated,
  globalStudents,
  reloadGlobalStudents,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [page, setPage] = useState(0)

  // Local filtered query state
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null)
  const [studentToView, setStudentToView] = useState<Student | null>(null)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Extract unique courses for filter dropdown
  const coursesList = useMemo(() => {
    const set = new Set<string>()
    globalStudents.forEach((s) => {
      if (s.course && s.course.trim()) {
        set.add(s.course.trim())
      }
    })
    return Array.from(set).sort()
  }, [globalStudents])

  // Fetch students using the real backend GET /students endpoint with filters
  const fetchStudents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await studentApi.listStudents({
        name: searchTerm.trim() || undefined,
        course: courseFilter.trim() || undefined,
        skip: page * PAGE_SIZE,
        limit: PAGE_SIZE + 1, // request 1 extra to accurately determine hasMore
      })

      if (data.length > PAGE_SIZE) {
        setHasMore(true)
        setStudents(data.slice(0, PAGE_SIZE))
      } else {
        setHasMore(false)
        setStudents(data)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch student records.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, courseFilter, page])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  // Reset page to 0 when search term or course filter changes
  const handleSearchChange = (val: string) => {
    setSearchTerm(val)
    setPage(0)
  }

  const handleCourseChange = (val: string) => {
    setCourseFilter(val)
    setPage(0)
  }

  // Handle Create or Edit success
  const handleFormSuccess = async (savedStudent: Student, isEdit: boolean) => {
    onAddToast({
      title: isEdit ? 'Record Updated' : 'Student Registered',
      message: isEdit
        ? `Student '${savedStudent.full_name}' (${savedStudent.student_id}) was successfully updated.`
        : `Student '${savedStudent.full_name}' (${savedStudent.student_id}) has been successfully enrolled.`,
      type: 'success',
    })
    await fetchStudents()
    await reloadGlobalStudents()
    onStudentsUpdated()
  }

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!studentToDelete) return
    setIsDeleting(true)
    try {
      await studentApi.deleteStudent(studentToDelete.student_id)
      onAddToast({
        title: 'Record Deleted',
        message: `Student record '${studentToDelete.full_name}' (${studentToDelete.student_id}) was permanently removed.`,
        type: 'info',
      })
      setStudentToDelete(null)
      await fetchStudents()
      await reloadGlobalStudents()
      onStudentsUpdated()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete student record.'
      onAddToast({
        title: 'Deletion Failed',
        message: msg,
        type: 'error',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Students Directory</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
            Search, filter, view, edit, and maintain student enrollment records.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus size={16} strokeWidth={2} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <StudentTable
          students={students}
          isLoading={isLoading}
          error={error}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          courseFilter={courseFilter}
          onCourseChange={handleCourseChange}
          coursesList={coursesList}
          onRefresh={fetchStudents}
          onViewStudent={(student) => setStudentToView(student)}
          onEditStudent={(student) => setStudentToEdit(student)}
          onDeleteStudent={(student) => setStudentToDelete(student)}
          onOpenCreate={() => setIsCreateOpen(true)}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={(newPage) => setPage(newPage)}
          hasMore={hasMore}
        />
      </div>

      {/* Create Modal */}
      <StudentFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Edit Modal */}
      <StudentFormModal
        isOpen={Boolean(studentToEdit)}
        studentToEdit={studentToEdit}
        onClose={() => setStudentToEdit(null)}
        onSuccess={handleFormSuccess}
      />

      {/* Detail Modal */}
      <StudentDetailModal
        isOpen={Boolean(studentToView)}
        student={studentToView}
        onClose={() => setStudentToView(null)}
        onEdit={(student) => {
          setStudentToView(null)
          setStudentToEdit(student)
        }}
        onDelete={(student) => {
          setStudentToView(null)
          setStudentToDelete(student)
        }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(studentToDelete)}
        title="Confirm Student Deletion"
        message={`Are you sure you want to delete student "${studentToDelete?.full_name}" (ID: ${studentToDelete?.student_id})? This will permanently delete the record from SQLite storage.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        isConfirming={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  )
}
