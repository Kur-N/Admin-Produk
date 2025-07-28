<template>
  <div class="layout">
    <Sidebar />
    <div class="main-content">
      <header class="header">
        <h1>{{ title }}</h1>
        <div class="header-actions">
          <slot name="actions"></slot>
        </div>
      </header>
      <main class="content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'

interface Props {
  title: string
}

defineProps<Props>()
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
}

.content {
  flex: 1;
  padding: 2rem;
  background-color: var(--gray-50);
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 200px;
  }
  
  .header {
    padding: 1rem;
  }
  
  .content {
    padding: 1rem;
  }
}
</style>