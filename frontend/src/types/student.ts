export interface Student {
  student_id: string
  full_name: string
  date_of_birth: string // YYYY-MM-DD
  email: string | null
  phone: string | null
  course: string | null
  address: string | null
  enrollment_date: string | null // YYYY-MM-DD
}

export interface StudentFormData {
  student_id: string
  full_name: string
  date_of_birth: string
  email: string
  phone: string
  course: string
  address: string
  enrollment_date: string
}

export interface StudentCreatePayload {
  student_id: string
  full_name: string
  date_of_birth: string
  email?: string | null
  phone?: string | null
  course?: string | null
  address?: string | null
  enrollment_date?: string | null
}

export interface StudentUpdatePayload {
  full_name?: string
  date_of_birth?: string
  email?: string | null
  phone?: string | null
  course?: string | null
  address?: string | null
  enrollment_date?: string | null
}

export interface FilterParams {
  name?: string
  course?: string
  skip?: number
  limit?: number
}

export interface HealthResponse {
  status: string
  database: string
}

export interface ApiValidationErrorDetail {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface ApiErrorResponse {
  detail: string | ApiValidationErrorDetail[]
}
