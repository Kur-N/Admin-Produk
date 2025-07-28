<template>
  <Layout title="Dashboard">
    <div class="dashboard">
      <div class="welcome-card card">
        <h2>Welcome to Seller Dashboard! 👋</h2>
        <p>Manage your products and track your business performance from here.</p>
      </div>
      
      <div class="quick-actions card">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <router-link to="/products/new" class="btn btn-primary">
            ➕ Add New Product
          </router-link>
          <router-link to="/products" class="btn btn-secondary">
            📋 View All Products
          </router-link>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Layout from '../components/Layout.vue'

</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
}

.welcome-card h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.welcome-card p {
  font-size: 1.125rem;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  background-color: var(--primary-100);
  padding: 1rem;
  border-radius: 0.5rem;
}

.stat-content h3 {
  color: var(--gray-600);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
}

.quick-actions h3 {
  margin-bottom: 1rem;
  color: var(--gray-900);
}

.actions-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    flex-direction: column;
  }
}
</style>