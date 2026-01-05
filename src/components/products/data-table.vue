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
import { NativeSelect } from '@/components/ui/native-select'
import { Label } from '@/components/ui/label'
import api from '@/services/api'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  categories: any[]
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
  meta: {
    get categories() { return props.categories },
    refresh: () => emit('refresh'),
  },
})

const open = ref(false)
const loading = ref(false)
const displayPrice = ref('') // Adicionado: Faltava declarar esta variável

const form = ref({
  name: '',
  description: '',
  price: 0.01,
  quantity: 1,
  category_id: '',
  status: true,
  image: null,
})

const handlePriceInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')

  if (value === '') {
    form.value.price = 0
    displayPrice.value = ''
    return
  }

  const numericValue = Number(value) / 100
  form.value.price = numericValue

  displayPrice.value = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue)
}

const handleSubmit = async () => {
  if (form.value.quantity < 1) return

  loading.value = true
  try {
    await api.post('/product', {
     ...form.value,
      category_id: form.value.category_id,
    })

    open.value = false
    form.value = { name: '', description: '', price: 0.01, quantity: 1, category_id: '', status: true, image: null }
    displayPrice.value = ''
    emit('refresh')
  } catch (error) {
    console.error('Erro ao criar produto:', error)
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
          <Button> <Plus class="w-4 h-4 mr-2" /> Novo produto </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-125">
          <form @submit.prevent="handleSubmit">
            <DialogHeader>
              <DialogTitle>Criar novo produto</DialogTitle>
              <DialogDescription> Adicione os detalhes técnicos do produto abaixo. </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4">
              <div class="grid gap-2">
                <Label for="name">Nome</Label>
                <Input id="name" v-model="form.name" minlength="3" required />
              </div>

              <div class="grid gap-2">
                <Label for="description">Descrição</Label>
                <Input id="description" v-model="form.description" placeholder="Breve descrição do produto" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="price">Preço</Label>
                  <Input
                    id="price"
                    type="text"
                    placeholder="R$ 0,00"
                    :value="displayPrice"
                    @input="handlePriceInput"
                    required
                  />
                </div>
                <div class="grid gap-2">
                  <Label for="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    v-model="form.quantity"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div class="grid gap-2">
                <Label>Categoria</Label>
                <NativeSelect v-model="form.category_id" required>
                  <option value="">Selecione uma categoria</option>
                  <option v-for="cat in categories" :key="cat.uuid" :value="cat.uuid">
                    {{ cat.name }}
                  </option>
                </NativeSelect>
              </div>

              <div class="flex items-center space-x-2">
                <Checkbox id="status" :checked="form.status" @update:checked="form.status = $event" :default-value=true />
                <Label for="status">Produto Ativo</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" :disabled="loading || form.quantity < 1">
                {{ loading ? 'Salvando...' : 'Salvar Produto' }}
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
