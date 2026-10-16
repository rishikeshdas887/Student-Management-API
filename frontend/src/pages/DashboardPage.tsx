import React from 'react'
import type { Student } from '../types/student'
import { StatCard } from '../components/dashboard/StatCard'
import { RecentStudents } from '../components/dashboard/RecentStudents'
import { Users, BookOpen, Mail, Phone, Plus } from 'lucide-react'

interface DashboardPageProps {
  students: Student[]
  isLoading: boolean
  onNavigateToStudents: () => void
  onOpenCreateModal: () => void
  onViewStudent: (student: Student) => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  students,
  isLoading,
  onNavigateToStudents,
  onOpenCreateModal,
  onViewStudent,
}) => {
  // Derive real statistics from live backend data
  const totalStudents = students.length

  const uniqueCourses = new Set(
    students
      .map((s) => s.course?.trim())
      .filter((c): c is string => Boolean(c && c.length > 0))
  )
  const courseCount = uniqueCourses.size

  const studentsWithEmail = students.filter((s) => Boolean(s.email && s.email.trim())).length
  const studentsWithPhone = students.filter((s) => Boolean(s.phone && s.phone.trim())).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border-dark)',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Academic Student Administration
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', maxWidth: '650px' }}>
            Unified record management platform connected to the FastAPI SQLite engine.
            Real-time enrollment tracking, contact management, and course allocation.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onNavigateToStudents}
          >
            <Users size={15} />
            <span>View All Records</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenCreateModal}
          >
            <Plus size={15} strokeWidth={2} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Real Statistics Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Enrolled student records"
          icon={<Users size={18} strokeWidth={1.75} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Active Courses"
          value={courseCount}
          subtitle="Derived from assigned majors"
          icon={<BookOpen size={18} strokeWidth={1.75} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Email Contacts"
          value={studentsWithEmail}
          subtitle={
            totalStudents > 0
              ? `${Math.round((studentsWithEmail / totalStudents) * 100)}% of student body`
              : 'Verified email profiles'
          }
          icon={<Mail size={18} strokeWidth={1.75} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Phone Contacts"
          value={studentsWithPhone}
          subtitle={
            totalStudents > 0
              ? `${Math.round((studentsWithPhone / totalStudents) * 100)}% reachable via mobile`
              : 'Verified phone profiles'
          }
          icon={<Phone size={18} strokeWidth={1.75} />}
          isLoading={isLoading}
        />
      </div>

      {/* Main Grid: Recent Registrations & System Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
        }}
        className="dashboard-two-col"
      >
        {/* Recent Students */}
        <RecentStudents
          students={students}
          isLoading={isLoading}
          onViewStudent={onViewStudent}
          onViewAll={onNavigateToStudents}
          onAddStudent={onOpenCreateModal}
        />

        {/* System Overview Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>System Integrity</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Operational parameters & storage
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Backend Architecture</span>
              <span style={{ fontWeight: 600 }}>FastAPI (Python)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Database Layer</span>
              <span style={{ fontWeight: 600 }}>SQLite via SQLAlchemy</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Validation Pipeline</span>
              <span style={{ fontWeight: 600 }}>Pydantic v2 Strict</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Client Protocol</span>
              <span style={{ fontWeight: 600 }}>REST JSON / Vite Proxy</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Visual Identity</span>
              <span style={{ fontWeight: 600 }}>Monochrome Enterprise</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 'auto',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              backgroundColor: 'var(--color-surface-subtle)',
              fontSize: '0.75rem',
              lineHeight: '1.4',
              color: 'var(--color-text-secondary)',
            }}
          >
            All data modifications through this dashboard execute direct transactions on the SQLite database file with automatic rollback on error.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .dashboard-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
