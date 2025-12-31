<script setup lang="ts" generic="TData, TValue">
import { ref,defineEmits } from 'vue'
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import { valueUpdater } from '@/components/ui/table/utils'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import api from '@/services/api'
import { isAxiosError } from 'axios'

import { Label } from '@/components/ui/label'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const rowSelection = ref({})

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get rowSelection() {
      return rowSelection.value
    },
  },
})

const emit = defineEmits(['refresh'])


const name = ref('')
const loading = ref(false)
const errorMessage = ref('')
const open = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await api.post('/category', {
      name: name.value,
    })
    name.value = ''
    open.value = false

    emit('refresh')
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || 'Email ou senha incorretos.'
    } else {
      errorMessage.value = 'Ocorreu um erro inesperado.'
    }
    console.error('Erro no login:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between py-4 gap-4">
      <Input
        class="max-w-sm"
        placeholder="Pesquisar categoria pelo nome..."
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value="table.getColumn('name')?.setFilterValue($event)"
      />

      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button> <Plus class="w-4 h-4 mr-2" /> Nova categoria </Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-[425px]">
          <form @submit.prevent="handleSubmit">
            <DialogHeader>
              <DialogTitle>Criar nova categoria</DialogTitle>
              <DialogDescription>
                Adicione os detalhes da nova categoria abaixo.
              </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4">
              <div class="grid gap-3">
                <Label for="name-1">Nome</Label>
                <Input
                  id="name-1"
                  v-model="name"
                  name="name"
                  placeholder="Ex: Eletrônicos"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose as-child>
                <Button variant="outline" type="button"> Cancelar </Button>
              </DialogClose>
              <Button type="submit" :disabled="loading">
                {{ loading ? 'Processando...' : 'Salvar' }}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <div class="w-full">
      <div class="border rounded-md bg-card">
        <Table class="table-fixed w-full">
          <TableHeader>
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <TableHead
                v-for="header in headerGroup.headers"
                :key="header.id"
                :style="{ width: `${header.getSize()}px` }"
              >
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                :data-state="row.getIsSelected() ? 'selected' : undefined"
              >
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="truncate">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} de
        {{ table.getFilteredRowModel().rows.length }} selecionado(s).
      </div>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()"
      >
        Anterior
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()"
      >
        Próximo
      </Button>
    </div>
  </div>
</template>
