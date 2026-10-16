import React, { useState, useEffect, useMemo } from 'react'
import { Modal } from '../common/Modal'
import type { Student, StudentCreatePayload, StudentUpdatePayload } from '../../types/student'
import { studentApi, ApiError } from '../../services/api'
import { AlertCircle, Check } from 'lucide-react'

interface StudentFormModalProps {
  isOpen: boolean
  onClose: () => void
  studentToEdit?: Student | null
  onSuccess: (student: Student, isEdit: boolean) => void
}

interface FormErrors {
  student_id?: string
  full_name?: string
  date_of_birth?: string
  email?: string
  phone?: string
  contact?: string
  course?: string
  address?: string
  enrollment_date?: string
  general?: string
}

const PHONE_REGEX = /^\+?[0-9 (). -]+$/
const STUDENT_ID_REGEX = /^[A-Za-z0-9_-]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_DATE = '1900-01-01'

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  studentToEdit,
  onSuccess,
}) => {
  const isEdit = Boolean(studentToEdit)

  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    date_of_birth: '',
    email: '',
    phone: '',
    course: '',
    address: '',
    enrollment_date: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        student_id: studentToEdit.student_id,
        full_name: studentToEdit.full_name,
        date_of_birth: studentToEdit.date_of_birth,
        email: studentToEdit.email || '',
        phone: studentToEdit.phone || '',
        course: studentToEdit.course || '',
        address: studentToEdit.address || '',
        enrollment_date: studentToEdit.enrollment_date || '',
      })
    } else {
      setFormData({
        student_id: '',
        full_name: '',
        date_of_birth: '',
        email: '',
        phone: '',
        course: '',
        address: '',
        enrollment_date: '',
      })
    }
    setErrors({})
    setIsSubmitting(false)
  }, [studentToEdit, isOpen])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    // Student ID (only validated on creation)
    if (!isEdit) {
      const id = formData.student_id.trim()
      if (!id) {
        newErrors.student_id = 'Student ID is required.'
      } else if (id.length > 32) {
        newErrors.student_id = 'Student ID cannot exceed 32 characters.'
      } else if (!STUDENT_ID_REGEX.test(id)) {
        newErrors.student_id = 'Student ID must contain only alphanumeric characters, dashes, or underscores.'
      }
    }

    // Full Name
    const name = formData.full_name.trim()
    if (!name) {
      newErrors.full_name = 'Full name is required.'
    } else if (name.length < 2) {
      newErrors.full_name = 'Full name must have at least 2 characters.'
    } else if (name.length > 100) {
      newErrors.full_name = 'Full name cannot exceed 100 characters.'
    }

    // Date of Birth
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required.'
    } else {
      if (formData.date_of_birth < MIN_DATE) {
        newErrors.date_of_birth = 'Date of birth must be on or after 1900-01-01.'
      } else if (formData.date_of_birth > todayStr) {
        newErrors.date_of_birth = 'Date of birth cannot be in the future.'
      }
    }

    // Email
    const email = formData.email.trim()
    if (email) {
      if (!EMAIL_REGEX.test(email)) {
        newErrors.email = 'Please enter a valid email address.'
      } else if (email.length > 255) {
        newErrors.email = 'Email address cannot exceed 255 characters.'
      }
    }

    // Phone
    const phone = formData.phone.trim()
    if (phone) {
      const digits = phone.replace(/\D/g, '')
      if (!PHONE_REGEX.test(phone) || digits.length < 7 || digits.length > 15) {
        newErrors.phone = 'Phone must contain 7–15 digits with valid separators (+, -, spaces, parentheses).'
      }
    }

    // At least one contact rule
    if (!email && !phone) {
      newErrors.contact = 'At least one contact method is required: please provide an email or phone number.'
    }

    // Course
    if (formData.course.trim().length > 100) {
      newErrors.course = 'Course cannot exceed 100 characters.'
    }

    // Address
    if (formData.address.trim().length > 255) {
      newErrors.address = 'Address cannot exceed 255 characters.'
    }

    // Enrollment Date
    if (formData.enrollment_date) {
      if (formData.date_of_birth && formData.enrollment_date < formData.date_of_birth) {
        newErrors.enrollment_date = 'Enrollment date cannot be earlier than date of birth.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if ((name === 'email' || name === 'phone') && errors.contact) {
      setErrors((prev) => ({ ...prev, contact: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      if (isEdit && studentToEdit) {
        // Edit mode (PATCH /students/{id})
        const patchPayload: StudentUpdatePayload = {
          full_name: formData.full_name.trim(),
          date_of_birth: formData.date_of_birth,
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          course: formData.course.trim() || null,
          address: formData.address.trim() || null,
          enrollment_date: formData.enrollment_date || null,
        }
        const updated = await studentApi.updateStudent(studentToEdit.student_id, patchPayload)
        onSuccess(updated, true)
        onClose()
      } else {
        // Create mode (POST /students)
        const createPayload: StudentCreatePayload = {
          student_id: formData.student_id.trim(),
          full_name: formData.full_name.trim(),
          date_of_birth: formData.date_of_birth,
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          course: formData.course.trim() || null,
          address: formData.address.trim() || null,
          enrollment_date: formData.enrollment_date || null,
        }
        const created = await studentApi.createStudent(createPayload)
        onSuccess(created, false)
        onClose()
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setErrors({ student_id: err.message })
        } else {
          setErrors({ general: err.message })
        }
      } else {
        setErrors({ general: 'An unexpected error occurred while saving the student record.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Student: ${studentToEdit?.student_id}` : 'Create New Student'}
      maxWidth="620px"
      footer={
        <>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check size={16} strokeWidth={2} />
                <span>{isEdit ? 'Save Changes' : 'Create Student'}</span>
              </>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {errors.general && (
          <div className="form-error-banner" role="alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <AlertCircle size={16} />
              <span>Submission Error</span>
            </div>
            <div style={{ marginTop: '0.25rem' }}>{errors.general}</div>
          </div>
        )}

        {errors.contact && (
          <div className="form-error-banner" role="alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <AlertCircle size={16} />
              <span>Contact Requirement</span>
            </div>
            <div style={{ marginTop: '0.25rem' }}>{errors.contact}</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Student ID */}
          <div className="form-group">
            <label className="form-label" htmlFor="student_id">
              <span>Student ID</span>
              <span className="required-indicator">{isEdit ? 'Read-only' : 'Required'}</span>
            </label>
            <input
              id="student_id"
              name="student_id"
              type="text"
              className="form-input font-mono"
              placeholder="e.g. STU1001"
              value={formData.student_id}
              onChange={handleChange}
              disabled={isEdit || isSubmitting}
              autoComplete="off"
            />
            {errors.student_id ? (
              <span className="form-error">{errors.student_id}</span>
            ) : (
              <span className="form-help">Unique identifier (letters, digits, dashes, underscores).</span>
            )}
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="full_name">
              <span>Full Name</span>
              <span className="required-indicator">Required</span>
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              className="form-input"
              placeholder="e.g. Asha Verma"
              value={formData.full_name}
              onChange={handleChange}
              disabled={isSubmitting}
              autoComplete="name"
            />
            {errors.full_name && <span className="form-error">{errors.full_name}</span>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Date of Birth */}
          <div className="form-group">
            <label className="form-label" htmlFor="date_of_birth">
              <span>Date of Birth</span>
              <span className="required-indicator">Required</span>
            </label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              className="form-input"
              max={todayStr}
              min={MIN_DATE}
              value={formData.date_of_birth}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.date_of_birth && <span className="form-error">{errors.date_of_birth}</span>}
          </div>

          {/* Course */}
          <div className="form-group">
            <label className="form-label" htmlFor="course">
              <span>Course / Major</span>
              <span className="required-indicator">Optional</span>
            </label>
            <input
              id="course"
              name="course"
              type="text"
              className="form-input"
              placeholder="e.g. Computer Science"
              value={formData.course}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.course && <span className="form-error">{errors.course}</span>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <span>Email Address</span>
              <span className="required-indicator">Email or Phone required</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="asha.verma@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              <span>Phone Number</span>
              <span className="required-indicator">Email or Phone required</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="form-input"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              autoComplete="tel"
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Enrollment Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="enrollment_date">
              <span>Enrollment Date</span>
              <span className="required-indicator">Optional</span>
            </label>
            <input
              id="enrollment_date"
              name="enrollment_date"
              type="date"
              className="form-input"
              min={formData.date_of_birth || MIN_DATE}
              value={formData.enrollment_date}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.enrollment_date ? (
              <span className="form-error">{errors.enrollment_date}</span>
            ) : (
              <span className="form-help">Must not precede date of birth.</span>
            )}
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="address">
              <span>Residential Address</span>
              <span className="required-indicator">Optional</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-input"
              placeholder="12 Lake Road, Pune"
              value={formData.address}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>
        </div>
      </form>
    </Modal>
  )
}
