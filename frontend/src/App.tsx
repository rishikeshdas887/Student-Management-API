import { useState, useEffect, useCallback } from 'react'
import type { Student } from './types/student'
import { studentApi } from './services/api'
import { useBackendHealth } from './hooks/useBackendHealth'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { DashboardPage } from './pages/DashboardPage'
import { StudentsPage } from './pages/StudentsPage'
import { StudentFormModal } from './components/students/StudentFormModal'
import { StudentDetailModal } from './components/students/StudentDetailModal'
import { ToastContainer } from './components/common/Toast'
import type { ToastMessage } from './components/common/Toast'

export function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'students'>('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Global students list for stats & courses
  const [globalStudents, setGlobalStudents] = useState<Student[]>([])
  const [isGlobalLoading, setIsGlobalLoading] = useState(true)

  // Backend Health check
  const health = useBackendHealth(15000)

  // Modals state
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false)
  const [selectedStudentForView, setSelectedStudentForView] = useState<Student | null>(null)

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Load all students for aggregate stats
  const reloadGlobalStudents = useCallback(async () => {
    setIsGlobalLoading(true)
    try {
      const data = await studentApi.listStudents({ limit: 500 })
      setGlobalStudents(data)
    } catch {
      // Errors handled gracefully without breaking UI
    } finally {
      setIsGlobalLoading(false)
    }
  }, [])

  useEffect(() => {
    reloadGlobalStudents()
  }, [reloadGlobalStudents])

  const handleQuickCreateSuccess = (newStudent: Student) => {
    addToast({
      title: 'Student Registered',
      message: `Student '${newStudent.full_name}' (${newStudent.student_id}) has been added successfully.`,
      type: 'success',
    })
    reloadGlobalStudents()
  }

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Topbar
          title={currentTab === 'dashboard' ? 'Academic Dashboard' : 'Student Directory'}
          subtitle={
            currentTab === 'dashboard'
              ? 'Institutional metrics, enrollments, and health monitoring'
              : 'Complete academic records and cohort administration'
          }
          health={health}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenCreateModal={() => setIsQuickCreateOpen(true)}
        />

        <main className="page-wrapper" id="main-content">
          {currentTab === 'dashboard' ? (
            <DashboardPage
              students={globalStudents}
              isLoading={isGlobalLoading}
              onNavigateToStudents={() => setCurrentTab('students')}
              onOpenCreateModal={() => setIsQuickCreateOpen(true)}
              onViewStudent={(student) => setSelectedStudentForView(student)}
            />
          ) : (
            <StudentsPage
              onAddToast={addToast}
              onStudentsUpdated={reloadGlobalStudents}
              globalStudents={globalStudents}
              reloadGlobalStudents={reloadGlobalStudents}
            />
          )}
        </main>
      </div>

      {/* Quick Create Student Modal */}
      <StudentFormModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
        onSuccess={handleQuickCreateSuccess}
      />

      {/* View Details Modal from Dashboard */}
      <StudentDetailModal
        isOpen={Boolean(selectedStudentForView)}
        student={selectedStudentForView}
        onClose={() => setSelectedStudentForView(null)}
        onEdit={() => {
          setSelectedStudentForView(null)
          setCurrentTab('students')
        }}
        onDelete={() => {
          setSelectedStudentForView(null)
          setCurrentTab('students')
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
export default App
