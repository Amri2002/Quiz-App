// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// API Client
class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      throw new Error(error.detail || 'Request failed')
    }

    return response.json()
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' })
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

// Auth API
export const authApi = {
  async signup(data: {
    email: string
    username: string
    password: string
    full_name?: string
    is_teacher: boolean
  }) {
    return apiClient.post('/api/auth/signup', data)
  },

  async login(email: string, password: string) {
    const response = await apiClient.post('/api/auth/login', { email, password })
    if (response.access_token) {
      apiClient.setToken(response.access_token)
    }
    return response
  },

  async getCurrentUser() {
    return apiClient.get('/api/auth/me')
  },

  async verifyToken() {
    return apiClient.get('/api/auth/verify')
  },

  logout() {
    apiClient.clearToken()
  },
}

// User types
export interface User {
  id: number
  email: string
  username: string
  full_name: string | null
  is_active: boolean
  is_teacher: boolean
  created_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

// Class types
export interface ClassData {
  id: number
  name: string
  description: string | null
  join_code: string
  teacher_id: number
  is_archived: boolean
  created_at: string
  student_count?: number
}

export interface StudentInClass {
  id: number
  username: string
  full_name: string | null
  email: string
  enrolled_at: string
}

export interface ClassDetail extends ClassData {
  students: StudentInClass[]
}

// Classes API
export const classesApi = {
  async createClass(data: { name: string; description?: string }) {
    return apiClient.post('/api/classes/', data)
  },

  async getMyClasses(includeArchived: boolean = false) {
    return apiClient.get(`/api/classes/my-classes?include_archived=${includeArchived}`)
  },

  async getClassDetails(classId: number): Promise<ClassDetail> {
    return apiClient.get(`/api/classes/${classId}`)
  },

  async joinClass(joinCode: string) {
    return apiClient.post('/api/classes/join', { join_code: joinCode })
  },

  async updateClass(classId: number, data: { name?: string; description?: string; is_archived?: boolean }) {
    return apiClient.patch(`/api/classes/${classId}`, data)
  },

  async removeStudent(classId: number, studentId: number) {
    return apiClient.delete(`/api/classes/${classId}/students/${studentId}`)
  },

  async deleteClass(classId: number) {
    return apiClient.delete(`/api/classes/${classId}`)
  },
}
