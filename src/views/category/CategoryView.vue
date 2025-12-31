<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { columns } from '@/components/category/columnsCategory'
import DataTable from '@/components/category/data-table-Category.vue'
import api from '@/services/api'

const categories = ref([])
const loading = ref(true)

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await api.get('/category')

    // ATENÇÃO AQUI:
    // response.data é o objeto completo que você postou
    // response.data.data é o array com as categorias [ {id: 1, name: "Gamer"}, ... ]
    categories.value = response.data.data

  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Gestão de Categorias</h1>

    <DataTable
      :columns="columns"
      :data="categories"
      @refresh="fetchCategories"
    />
  </div>
</template>
