import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import ProductActions from './ProductActions.vue'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ImageIcon } from 'lucide-vue-next'

const baseURL = import.meta.env.API_BASE_URL || 'http://127.0.0.1:8000'
export interface Product {
  uuid: string
  id: number
  name: string
  description: string
  price: number
  quantity: number
  status: boolean
  image: string | null
  category: {
    uuid: string
    name: string
  }
  created_at: string
}

export const columns: ColumnDef<Product>[] = [
{
    accessorKey: 'image',
    header: '',
    size: 50,
    cell: ({ row }) => {
      const imageUrl = row.original.image
        ? `${baseURL}${row.original.image}`
        : null

      return h(Avatar, { class: 'h-10 w-10 border' }, () => [
        imageUrl
          ? h(AvatarImage, { src: imageUrl, class: 'object-cover' })
          : null,
        h(AvatarFallback, { class: 'bg-muted' }, () =>
          h(ImageIcon, { class: 'h-4 w-4 text-muted-foreground' })
        ),
      ])
    },
  },
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
    cell: ({ row }) => h('div', {}, row.original.category?.name || ' - '),
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
    accessorKey: 'quantity',
    header: () => h('div', { class: 'text-center' }, 'Qtd.'),
    cell: ({ row }) => h('div', { class: 'text-center font-medium' }, row.getValue('quantity')),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as boolean
      return h(Badge, { variant: status ? 'default' : 'destructive' }, () =>
        status ? 'Ativo' : 'Inativo',
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Criado em',
    cell: ({ row }) => h('div', { class: 'text-muted-foreground' }, row.getValue('created_at')),
  },
  {
    id: 'actions',
    size: 50,
    cell: ({ row, table }) => {
      const product = row.original
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
