import axios from 'axios'
import { LoginResponse, Profile } from '../types/auth'
import { Category, Product, ProductFilters, ProductForCreate, ProductForUpdate } from '../types/product'
import { UploadedFile } from '../types/files'

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
    const response = await api.post<LoginResponse>('/auth/login', { email, password })
    return response.data
  },
  
  getProfile: async () => {
    const response = await api.get<Profile>('/auth/profile')
    return response.data
  }
}

// Products API
export const productsAPI = {
  getProducts: async (offset = 0, limit = 5) => {
    const response = await api.get<Product[]>(`/products?offset=${offset}&limit=${limit}`)
    return response.data
  },
  
  getProduct: async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },
  
  createProduct: async (productData: ProductForCreate) => {
    const response = await api.post<Product>('/products', productData)
    return response.data
  },
  
  updateProduct: async (id: number, productData: ProductForUpdate) => {
    const response = await api.put<Product>(`/products/${id}`, productData)
    return response.data
  },
  
  deleteProduct: async (id: number) => {
    const response = await api.delete<boolean>(`/products/${id}`)
    return response.data
  },
  
  filterProducts: async (filters: ProductFilters) => {
    // let query = '/products?'
    const params = new URLSearchParams()
    
    if (filters.title) params.append('title', filters.title)
    if (filters.price_min) params.append('price_min', filters.price_min.toString())
    if (filters.price_max) params.append('price_max', filters.price_max.toString())
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString())
    if (filters.offset) params.append('offset', filters.offset.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    
    const response = await api.get<Product[]>(`/products?${params.toString()}`)
    return response.data
  }
}

// Categories API
export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get<Category[]>('/categories')
    return response.data
  }
}

// Files API
export const filesAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post<UploadedFile>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default api