<template>
  <Layout title="Products">
    <template #actions>
      <router-link to="/products/new" class="btn btn-primary">
        ➕ Add Product
      </router-link>
    </template>
    
    <!-- Filters -->
    <div class="filters card">
      <h3>Filters</h3>
      <div class="filter-grid">
        <div class="form-group">
          <label class="form-label">Search Title</label>
          <input
            v-model="filters.title"
            type="text"
            class="form-input"
            placeholder="Search products..."
            @input="applyFilters"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Min Price</label>
          <input
            v-model.number="filters.price_min"
            type="number"
            class="form-input"
            placeholder="Minimum price"
            @input="applyFilters"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Max Price</label>
          <input
            v-model.number="filters.price_max"
            type="number"
            class="form-input"
            placeholder="Maximum price"
            @input="applyFilters"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Category</label>
          <select v-model="filters.categoryId" class="form-select" @change="applyFilters">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="filter-actions">
        <button @click="clearFilters" class="btn btn-secondary">Clear Filters</button>
      </div>
    </div>
    
    <!-- Products Grid -->
    <div v-if="loading" class="loading">
      <p>Loading products...</p>
    </div>
    
    <div v-else class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card card">
        <div class="product-image">
          <img :src="getProxiedImageUrl(product.images[0])" :alt="product.title" />
        </div>
        
        <div class="product-content">
          <h3>{{ product.title }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-price">${{ product.price }}</div>
          <div class="product-category">{{ product.category.name }}</div>
        </div>
        
        <div class="product-actions">
          <button @click="editProduct(product.id)" class="btn btn-secondary">✏️ Edit</button>
          <button @click="deleteProduct(product.id)" class="btn btn-danger">🗑️ Delete</button>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="pagination">
      <button 
        @click="previousPage" 
        :disabled="currentPage === 1"
        class="btn btn-secondary"
      >
        Previous
      </button>
      
      <span class="pagination-info">
        Page {{ currentPage }}
      </span>
      
      <button 
        @click="nextPage" 
        :disabled="products.length < itemsPerPage"
        class="btn btn-secondary"
      >
        Next
      </button>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal" @click.stop>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this product? This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import { productsAPI, categoriesAPI } from '../services/api'

const router = useRouter()

const products = ref([])
const categories = ref([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 8

const filters = reactive({
  title: '',
  price_min: null,
  price_max: null,
  categoryId: ''
})

const showDeleteModal = ref(false)
const productToDelete = ref(null)

const loadProducts = async () => {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * itemsPerPage
    
    // Apply filters if any are set
    const hasFilters = filters.title || filters.price_min || filters.price_max || filters.categoryId
    
    let data
    if (hasFilters) {
      data = await productsAPI.filterProducts({
        ...filters,
        offset,
        limit: itemsPerPage
      })
    } else {
      data = await productsAPI.getProducts(offset, itemsPerPage)
    }
    
    products.value = data
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
}

const getProxiedImageUrl = (fullUrl: string) => {
  if (!fullUrl) return 'https://via.placeholder.com/300'; // Placeholder jika tidak ada URL

  const baseUrlToRemove = 'https://api.escuelajs.co'; // Harus cocok dengan target proxy Anda

  // Jika URL sudah berupa path relatif (misal: /api/v1/files/...)
  // maka tidak perlu di-replace lagi. Ini penting jika Anda memuat produk
  // yang sebelumnya sudah disimpan dengan path proxy
  if (fullUrl.startsWith(baseUrlToRemove)) {
    return fullUrl.replace(baseUrlToRemove, '');
  }
  return fullUrl; // Kembalikan apa adanya jika bukan dari domain API
};

const loadCategories = async () => {
  try {
    const data = await categoriesAPI.getCategories()
    categories.value = data
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const applyFilters = () => {
  currentPage.value = 1
  loadProducts()
}

const clearFilters = () => {
  filters.title = ''
  filters.price_min = null
  filters.price_max = null
  filters.categoryId = ''
  currentPage.value = 1
  loadProducts()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadProducts()
  }
}

const nextPage = () => {
  if (products.value.length === itemsPerPage) {
    currentPage.value++
    loadProducts()
  }
}

const editProduct = (id: string) => {
  router.push(`/products/edit/${id}`)
}

const deleteProduct = (id: string) => {
  productToDelete.value = id
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  productToDelete.value = null
}

const confirmDelete = async () => {
  if (productToDelete.value) {
    try {
      await productsAPI.deleteProduct(productToDelete.value)
      await loadProducts() // Reload products
      closeDeleteModal()
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }
}

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<style scoped>
.filters {
  margin-bottom: 2rem;
}

.filters h3 {
  margin-bottom: 1rem;
  color: var(--gray-900);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-image {
  height: 200px;
  overflow: hidden;
  border-radius: 0.5rem 0.5rem 0 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-content {
  flex: 1;
  padding: 1rem 0;
}

.product-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gray-900);
}

.product-description {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-600);
  margin-bottom: 0.25rem;
}

.product-category {
  font-size: 0.75rem;
  color: var(--gray-500);
  background-color: var(--gray-100);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.product-actions .btn {
  flex: 1;
  font-size: 0.875rem;
  padding: 0.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.pagination-info {
  color: var(--gray-600);
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>