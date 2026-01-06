<script setup lang="ts" generic="TData, TValue">
import { ref, defineEmits } from 'vue'
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import api from '@/services/api'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

const emit = defineEmits(['refresh'])

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const rowSelection = ref({})

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get rowSelection() { return rowSelection.value },
  },
})

const open = ref(false)
const loading = ref(false)

const form = ref({
  name: '',
  email: '',
  cpf_cnpj: '',
  phone: '',
  address: '',
  status: true,
})

const handleSubmit = async () => {

  loading.value = true
  try {
    await api.post('/clients', {
     ...form.value,
    })

    open.value = false
    form.value = { name: '', email: '', cpf_cnpj: '', phone: '', address: '', status: true,  }
    emit('refresh')
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
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
        placeholder="Pesquisar produto..."
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value="table.getColumn('name')?.setFilterValue($event)"
      />

      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button> <Plus class="w-4 h-4 mr-2" /> Novo Cliente </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-125">
          <form @submit.prevent="handleSubmit">
            <DialogHeader>
              <DialogTitle>Criar novo cliente</DialogTitle>
              <DialogDescription> Adicione os detalhes do cliente abaixo. </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4">
              <div class="grid gap-2">
                <Label for="name">Nome</Label>
                <Input id="name" v-model="form.name" minlength="3" required />
              </div>


              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="email">Email</Label>
                  <Input id="email" type="email" v-model="form.email" required />
                </div>
                <div class="grid gap-2">
                  <Label for="cpf_cnpj">CPF/CNPJ</Label>
                  <Input id="cpf_cnpj" v-model="form.cpf_cnpj" required />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="phone">Telefone</Label>
                  <Input id="phone" v-model="form.phone" required />
                </div>
                <div class="grid gap-2">
                  <Label for="address">Endereço</Label>
                  <Input id="address" v-model="form.address" required />
                </div>
              </div>



              <div class="flex items-center space-x-2">
                <Checkbox id="status" :checked="form.status" @update:checked="form.status = $event" :default-value=true />
                <Label for="status">Cliente Ativo</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" :disabled="loading">
                {{ loading ? 'Salvando...' : 'Salvar Cliente' }}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

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
          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              Nenhum resultado.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
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
