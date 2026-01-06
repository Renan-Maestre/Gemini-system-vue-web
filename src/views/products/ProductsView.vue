<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { columns } from '@/components/products/columns'
import DataTable from '@/components/products/data-table.vue'
import api from '@/services/api'

const products = ref([])
const categories = ref([])
const loading = ref(true)

const fetchData = async () => {
  loading.value = true
  try {
    const [prodRes, catRes] = await Promise.all([
      api.get('/product'),
      api.get('/category') // Busca as categorias para o select
    ])
    products.value = prodRes.data.data
    categories.value = catRes.data.data 
  } catch (error) {
    console.error("Erro:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchData())
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Gestão de Produtos</h1>
    <DataTable
      :columns="columns"
      :data="products"
      :categories="categories"
      @refresh="fetchData"
    />
  </div>
</template>
