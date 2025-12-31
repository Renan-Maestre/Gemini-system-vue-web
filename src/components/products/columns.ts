import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, ArrowUpDown } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'ativo' | 'inativo' | 'arquivado'
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    size: 400,
    header: ({ column }) =>
      h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Nome', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      ),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name')),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 100,
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      // Define a cor baseada no seu status
      const variant =
        status === 'ativo' ? 'default' : status === 'inativo' ? 'secondary' : 'destructive'

      return h(Badge, { variant, class: 'capitalize' }, () => status)
    },
  },
  {
    accessorKey: 'price',
    header: () => h('div', { class: 'text-right' }, 'Preço'),
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price)
      return h('div', { class: 'text-right font-medium' }, formatted)
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
