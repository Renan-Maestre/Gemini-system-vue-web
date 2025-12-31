import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import ProductActions from './ProductActions.vue'

export interface Product {
  id: number
  name: string
  price: number
  category: {
    id: number
    name: string
  }
  status?: string
  stock?: number
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 50,
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name')),
  },
  {
    // Acessando o nome dentro do objeto category
    accessorKey: 'category.name',
    header: 'Categoria',
    cell: ({ row }) => h('div', {}, row.original.category?.name || 'Sem categoria'),
  },
  {
    accessorKey: 'price',
    header: () => h('div', { class: 'text-center' }, 'Preço'),
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue('price'))
      return h(
        'div',
        { class: 'text-center' },
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price),
      )
    },
  },
  {
    accessorKey: 'stock',
    header: () => h('div', { class: 'text-center' }, 'Qtd.'),
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number
      return h('div', { class: 'text-center font-medium' }, stock)
    },
  },
  {
    id: 'actions',
    size: 50,
    cell: ({ row, table }) => {
      const product = row.original
      // Pegamos as categorias e a função de refresh passadas via 'meta' na tabela
      const { categories, refresh } = table.options.meta as {
        categories: { id: string; name: string }[]
        refresh: () => void
      }

      return h(ProductActions, {
        product,
        categories,
        onRefresh: () => refresh(),
      })
    },
  },
]
