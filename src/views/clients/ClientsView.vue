<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { columns } from '@/components/clients/columnsClients'
import DataTable from '@/components/clients/data-tableClients.vue'
import api from '@/services/api'

const products = ref([])
const loading = ref(true)

const fetchData = async () => {
  loading.value = true
  try {
    const [prodRes] = await Promise.all([
      api.get('/clients'), // Busca os produtos
    ])
    products.value = prodRes.data.data
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
    <h1 class="text-2xl font-bold mb-4">Gestão de Clientes</h1>
    <DataTable
      :columns="columns"
      :data="products"
      @refresh="fetchData"
    />
  </div>
</template>
