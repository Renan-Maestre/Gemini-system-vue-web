import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import ProductActionsClients from './ProductActionsClients.vue'
import { Badge } from '@/components/ui/badge'

export interface client {
  uuid: string
  id: number
  name: string
  email: string
  cpf_cnpj: string
  phone: string
  address: string
  status: boolean
  created_at: string
}

export const columns: ColumnDef<client>[] = [
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
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('email')),
  },
  {
    accessorKey: 'cpf_cnpj',
    header: 'CPF/CNPJ',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('cpf_cnpj')),
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('phone')),
  },
  {
    accessorKey: 'address',
    header: 'Endereço',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('address')),
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
    cell: ({ row, }) => {
      const client = row.original


      return h(ProductActionsClients, {
        client,
      })
    },
  },
]
