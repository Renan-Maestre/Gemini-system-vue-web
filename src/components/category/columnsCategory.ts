import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export interface Category {
  id: string
  name: string
  created_at?: string
}

export const columns: ColumnDef<Category>[] = [
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
