import type {
  Student,
  StudentCreatePayload,
  StudentUpdatePayload,
  FilterParams,
  HealthResponse,
  ApiErrorResponse,
} from '../types/student'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export class ApiError extends Error {
  public status: number
  public details: string | string[]

  constructor(status: number, message: string, details?: string | string[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details || message
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return {} as T
  }

  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`
    let errorDetails: string | string[] = errorMessage

    if (isJson && data) {
      const apiErr = data as ApiErrorResponse
      if (typeof apiErr.detail === 'string') {
        errorMessage = apiErr.detail
        errorDetails = apiErr.detail
      } else if (Array.isArray(apiErr.detail)) {
        const messages = apiErr.detail.map((err) => {
          const field = err.loc ? err.loc.filter((part) => part !== 'body').join('.') : 'Field'
          return field ? `${field}: ${err.msg}` : err.msg
        })
        errorMessage = messages.join('; ')
        errorDetails = messages
      }
    }

    if (!isJson && typeof data === 'string' && data.includes('<html')) {
      if (response.status === 502) {
        errorMessage = 'Gateway error (502): Unable to reach the backend service. Please ensure the FastAPI server is running on port 8000.'
      } else if (response.status === 504) {
        errorMessage = 'Gateway timeout (504): The backend server did not respond in time.'
      } else {
        errorMessage = `Server error (${response.status}). Please verify that the backend is running.`
      }
      errorDetails = errorMessage
    } else {
      if (response.status === 409) {
        errorMessage = typeof data?.detail === 'string' ? data.detail : 'Student ID already exists.'
      } else if (response.status === 404) {
        errorMessage = typeof data?.detail === 'string' ? data.detail : 'Student record not found.'
      } else if (response.status === 502) {
        errorMessage = 'Gateway error (502): Unable to reach the backend service. Please ensure the FastAPI server is running on port 8000.'
      } else if (response.status === 503) {
        errorMessage = 'Database or backend service is currently unreachable (503).'
      } else if (response.status === 504) {
        errorMessage = 'Gateway timeout (504): The backend server took too long to respond.'
      }
    }

    throw new ApiError(response.status, errorMessage, errorDetails)
  }

  return data as T
}

export const studentApi = {
  async getHealth(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      return handleResponse<HealthResponse>(response)
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError(0, 'Unable to connect to the backend server. Please verify it is running on port 8000.')
    }
  },

  async listStudents(params?: FilterParams): Promise<Student[]> {
    const query = new URLSearchParams()
    if (params?.name && params.name.trim()) {
      query.append('name', params.name.trim())
    }
    if (params?.course && params.course.trim()) {
      query.append('course', params.course.trim())
    }
    if (params?.skip !== undefined && params.skip >= 0) {
      query.append('skip', String(params.skip))
    }
    if (params?.limit !== undefined && params.limit > 0) {
      query.append('limit', String(params.limit))
    }

    const queryString = query.toString()
    const url = `${API_BASE_URL}/students${queryString ? `?${queryString}` : ''}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      return handleResponse<Student[]>(response)
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError(0, 'Failed to fetch student records from backend.')
    }
  },

  async getStudent(studentId: string): Promise<Student> {
    const encodedId = encodeURIComponent(studentId.trim())
    try {
      const response = await fetch(`${API_BASE_URL}/students/${encodedId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      return handleResponse<Student>(response)
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError(0, `Failed to load details for student '${studentId}'.`)
    }
  },

  async createStudent(payload: StudentCreatePayload): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })
      return handleResponse<Student>(response)
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError(0, 'Network error while attempting to create student record.')
    }
  },

  async updateStudent(studentId: string, payload: StudentUpdatePayload): Promise<Student> {
    const encodedId = encodeURIComponent(studentId.trim())
    try {
      const response = await fetch(`${API_BASE_URL}/students/${encodedId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })
      return handleResponse<Student>(response)
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError(0, `Network error while updating student '${studentId}'.`)
    }
  },

  async deleteStudent(studentId: string): Promise<void> {
    const encodedId = encodeURIComponent(studentId.trim())
    try {
      const response = await fetch(`${API_BASE_URL}/students/${encodedId}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      })
      await handleResponse<void>(response)
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError(0, `Network error while deleting student '${studentId}'.`)
    }
  },
}
