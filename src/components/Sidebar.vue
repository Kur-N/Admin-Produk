<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>Admin Panel</h2>
    </div>
    
    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item" active-class="active">
        <span class="nav-icon">📊</span>
        Dashboard
      </router-link>
      
      <router-link to="/products" class="nav-item" active-class="active">
        <span class="nav-icon">📦</span>
        Products
      </router-link>
    </nav>
    
    <div class="sidebar-footer">
      <button @click="handleLogout" class="btn btn-secondary logout-btn">
        <span class="nav-icon">🚪</span>
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: var(--gray-900);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-700);
}

.sidebar-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: var(--gray-300);
  text-decoration: none;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: var(--gray-800);
  color: white;
}

.nav-item.active {
  background-color: var(--primary-600);
  color: white;
}

.nav-icon {
  font-size: 1.25rem;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--gray-700);
}

.logout-btn {
  width: 100%;
  justify-content: center;
  background-color: var(--gray-800);
  color: var(--gray-300);
}

.logout-btn:hover {
  background-color: var(--gray-700);
  color: white;
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
}
</style>