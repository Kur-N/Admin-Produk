<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Seller Dashboard</h1>
        <p>Sign in to your account</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ 'error': errors.email }"
            required
          />
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="form-input"
            :class="{ 'error': errors.password }"
            required
          />
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>
        
        <div v-if="errors.general" class="error-message general-error">
          {{ errors.general }}
        </div>
        
        <button type="submit" class="btn btn-primary login-btn" :disabled="loading">
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>
      
      <div class="demo-credentials">
        <p><strong>Demo Credentials:</strong></p>
        <p>Email: john@mail.com</p>
        <p>Password: changeme</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'

const router = useRouter()

interface LoginForm {
  email: string;
  password: string;
}

interface LoginErrors {
  email: string;
  password: string;
  general: string;
}

const form = reactive<LoginForm>({
  email: 'john@mail.com',
  password: 'changeme'
})

const errors = reactive<LoginErrors>({
  email: '',
  password: '',
  general: ''
})

const loading = ref(false)

const handleLogin = async () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  loading.value = true
  
  try {
    const response = await authAPI.login(form.email, form.password)
    
    // Store token and user info
    localStorage.setItem('token', response.access_token)
    localStorage.setItem('refresh_token', response.refresh_token)
    
    // Redirect to dashboard
    router.push('/dashboard')
  } catch (error: any) {
    if (error.response?.status === 401) {
      errors.general = 'Invalid email or password'
    } else {
      errors.general = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.login-header p {
  color: var(--gray-600);
}

.login-form {
  space-y: 1rem;
}

.login-btn {
  width: 100%;
  justify-content: center;
  padding: 0.75rem;
  font-size: 1rem;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-input.error {
  border-color: var(--danger-600);
}

.general-error {
  text-align: center;
  background-color: var(--danger-100);
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.demo-credentials {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: var(--gray-50);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
}

.demo-credentials p {
  margin: 0.25rem 0;
}
</style>