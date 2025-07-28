<template>
  <Layout :title="isEdit ? 'Edit Product' : 'Add Product'">
    <template #actions>
      <router-link to="/products" class="btn btn-secondary">
        ← Back to Products
      </router-link>
    </template>
    
    <div class="product-form-container">
      <form @submit.prevent="handleSubmit" class="product-form card">
        <h2>{{ isEdit ? 'Edit Product' : 'Add New Product' }}</h2>
        
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input
              v-model="form.title"
              type="text"
              class="form-input"
              :class="{ error: errors.title }"
              required
            />
            <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Price *</label>
            <input
              v-model.number="form.price"
              type="number"
              class="form-input"
              :class="{ error: errors.price }"
              min="0"
              step="0.01"
              required
            />
            <div v-if="errors.price" class="error-message">{{ errors.price }}</div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Description *</label>
          <textarea
            v-model="form.description"
            class="form-input"
            :class="{ error: errors.description }"
            rows="4"
            required
          ></textarea>
          <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Category *</label>
          <select
            v-model="form.categoryId"
            class="form-select"
            :class="{ error: errors.categoryId }"
            required
          >
            <option value="">Select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <div v-if="errors.categoryId" class="error-message">{{ errors.categoryId }}</div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Product Image</label>
          <div class="image-upload">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="file-input"
            />
            <button type="button" @click="$refs.fileInput.click()" class="btn btn-secondary">
              📁 Choose Image
            </button>
            <span v-if="uploadingImage" class="upload-status">Uploading...</span>
          </div>
          
          <div v-if="displayImageUrl" class="image-preview">
            <img :src="displayImageUrl" alt="Product preview" />
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="handleCancel" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">{{ isEdit ? 'Updating...' : 'Creating...' }}</span>
            <span v-else>{{ isEdit ? 'Update Product' : 'Create Product' }}</span>
          </button>
        </div>
      </form>
    </div>
    
    <!-- Save Confirmation Modal -->
    <div v-if="showSaveModal" class="modal-overlay" @click="closeSaveModal">
      <div class="modal" @click.stop>
        <h3>Confirm Save</h3>
        <p>Are you sure you want to {{ isEdit ? 'update' : 'create' }} this product?</p>
        <div class="modal-actions">
          <button @click="closeSaveModal" class="btn btn-secondary">Cancel</button>
          <button @click="confirmSave" class="btn btn-success">
            {{ isEdit ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Cancel Confirmation Modal -->
    <div v-if="showCancelModal" class="modal-overlay" @click="closeCancelModal">
      <div class="modal" @click.stop>
        <h3>Confirm Cancel</h3>
        <p>Are you sure you want to cancel? All unsaved changes will be lost.</p>
        <div class="modal-actions">
          <button @click="closeCancelModal" class="btn btn-secondary">Stay</button>
          <button @click="confirmCancel" class="btn btn-danger">Leave</button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Layout from '../components/Layout.vue'
import { productsAPI, categoriesAPI, filesAPI } from '../services/api'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  price: 0,
  description: '',
  categoryId: '',
  images: []
})

const errors = reactive({
  title: '',
  price: '',
  description: '',
  categoryId: ''
})

const categories = ref([])
const loading = ref(false)
const uploadingImage = ref(false)
const showSaveModal = ref(false)
const showCancelModal = ref(false)

const loadCategories = async () => {
  try {
    const data = await categoriesAPI.getCategories()
    categories.value = data
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const loadProduct = async (id: string) => {
  try {
    const product = await productsAPI.getProduct(id)
    form.title = product.title
    form.price = product.price
    form.description = product.description
    form.categoryId = product.category.id
    form.images = product.images
    console.log(form.categoryId)
    console.log(product.category.id)
  } catch (error) {
    console.error('Failed to load product:', error)
    router.push('/products')
  }
}

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  uploadingImage.value = true
  
  try {
    const response = await filesAPI.uploadFile(file)
    form.images = [response.location]
    console.log(response)
    console.log(response.location)
    console.log(form.image)
  } catch (error) {
    console.error('Failed to upload image:', error)
    alert('Failed to upload image. Please try again.')
  } finally {
    uploadingImage.value = false
  }
}

const displayImageUrl = computed(() => {
  if (form.images && form.images.length > 0) {
    const fullUrl = form.images[0];
    const baseUrlToRemove = 'https://api.escuelajs.co'; // Pastikan ini sesuai dengan target proxy
    return fullUrl.replace(baseUrlToRemove, ''); // Akan menghasilkan '/api/v1/files/aded.webp'
  }
  return null; // Atau URL placeholder default
});

const validateForm = () => {
  let isValid = true
  
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  if (!form.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }
  
  if (!form.price || form.price <= 0) {
    errors.price = 'Price must be greater than 0'
    isValid = false
  }
  
  if (!form.description.trim()) {
    errors.description = 'Description is required'
    isValid = false
  }
  
  if (!form.categoryId) {
    errors.categoryId = 'Category is required'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = (event: Event) => {
  event.preventDefault()
  
  if (!validateForm()) {
    return
  }
  
  showSaveModal.value = true
}

const confirmSave = async () => {
  loading.value = true
  closeSaveModal()
  
  try {
    const productData = {
      title: form.title,
      price: form.price,
      description: form.description,
      categoryId: parseInt(form.categoryId as string),
      images: form.images.length > 0 ? form.images : ['https://via.placeholder.com/300']
    }
    console.log(productData)
    
    if (isEdit.value) {
      await productsAPI.updateProduct(route.params.id as string, productData)
    } else {
      await productsAPI.createProduct(productData)
    }
    
    //router.push('/products')
  } catch (error) {
    console.error('Failed to save product:', error)
    alert('Failed to save product. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  showCancelModal.value = true
}

const confirmCancel = () => {
  router.push('/products')
}

const closeSaveModal = () => {
  showSaveModal.value = false
}

const closeCancelModal = () => {
  showCancelModal.value = false
}

onMounted(() => {
  loadCategories()
  
  if (isEdit.value) {
    loadProduct(route.params.id as string)
    console.log(loadProduct)
  }
})
</script>

<style scoped>
.product-form-container {
  max-width: 800px;
  margin: 0 auto;
}

.product-form h2 {
  margin-bottom: 1.5rem;
  color: var(--gray-900);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.image-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.file-input {
  display: none;
}

.upload-status {
  color: var(--primary-600);
  font-size: 0.875rem;
}

.image-preview {
  margin-top: 1rem;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid var(--gray-200);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
}

.form-input.error,
.form-select.error {
  border-color: var(--danger-600);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .image-upload {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>