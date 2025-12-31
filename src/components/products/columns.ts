import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
    accessorKey: 'Ações',
    size: 50,
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original

      return h(
        DropdownMenu,
        {},
        {
          default: () => [
            h(DropdownMenuTrigger, { asChild: true }, () =>
              h(Button, { variant: 'ghost', class: 'h-8 w-8 p-0' }, () => [
                h('span', { class: 'sr-only' }, 'Abrir menu'),
                h(MoreHorizontal, { class: 'h-4 w-4' }),
              ]),
            ),
            h(DropdownMenuContent, { align: 'end' }, () => [
              h(DropdownMenuLabel, () => 'Ações'),
              h(
                DropdownMenuItem,
                {
                  onClick: () => navigator.clipboard.writeText(product.id),
                },
                () => 'Copiar ID do produto',
              ),
              h(DropdownMenuSeparator),
              h(DropdownMenuItem, () => 'Editar detalhes'),
              h(DropdownMenuItem, { class: 'text-destructive' }, () => 'Excluir produto'),
            ]),
          ],
        },
      )
    },
  },
]
