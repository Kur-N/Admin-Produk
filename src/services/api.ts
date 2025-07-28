import axios from 'axios'

const API_BASE = 'https://api.escuelajs.co/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  }
}

// Products API
export const productsAPI = {
  getProducts: async (offset = 0, limit = 5) => {
    const response = await api.get(`/products?offset=${offset}&limit=${limit}`)
    return response.data
  },
  
  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  
  createProduct: async (productData: any) => {
    const response = await api.post('/products', productData)
    return response.data
  },
  
  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },
  
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
  
  filterProducts: async (filters: any) => {
    // let query = '/products?'
    const params = new URLSearchParams()
    
    if (filters.title) params.append('title', filters.title)
    if (filters.price_min) params.append('price_min', filters.price_min.toString())
    if (filters.price_max) params.append('price_max', filters.price_max.toString())
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString())
    if (filters.offset) params.append('offset', filters.offset.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    
    const response = await api.get(`/products?${params.toString()}`)
    return response.data
  }
}

// Categories API
export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  }
}

// Files API
export const filesAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default api