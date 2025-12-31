<script setup lang="ts">
import { ref } from 'vue'
import { columns, type Product } from '@/components/products/columns'
import DataTable from '@/components/products/data-table.vue'

const products = ref<Product[]>([
  { id: '1', name: 'MacBook Pro', category: 'Eletrônicos', price: 12500, status: 'active', stock: 10 },
  { id: '2', name: 'iPhone 15', category: 'Mobile', price: 7500, status: 'active', stock: 25 },
  { id: '3', name: 'Cadeira Gamer', category: 'Móveis', price: 1200, status: 'draft', stock: 0 },
])
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Gestão de Produtos</h1>
    <DataTable :columns="columns" :data="products" />
  </div>
</template>
