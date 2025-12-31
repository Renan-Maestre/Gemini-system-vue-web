<script setup lang="ts" generic="TData, TValue">
import { ref } from 'vue'
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
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select'

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
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between py-4 gap-4">
      <Input
        class="max-w-sm"
        placeholder="Pesquisar produto pelo nome..."
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value="table.getColumn('name')?.setFilterValue($event)"
      />

      <Dialog>
        <form>
          <DialogTrigger as-child>
            <Button> <Plus class="w-4 h-4 mr-2" /> Novo Produto </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar novo produto</DialogTitle>
              <DialogDescription> Adicione os detalhes do novo produto abaixo. </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4">
              <div class="grid gap-3">
                <Label for="name-1">Nome</Label>
                <Input id="name-1" name="name" default-value="Pedro Duarte" />
              </div>
              <div class="grid gap-3">
                <FormField v-slot="{ field }" name="country">
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <NativeSelect v-bind="field">
                        <NativeSelectOption value=""> Selecione a Categoria </NativeSelectOption>
                        <NativeSelectOption value="us"> tetse </NativeSelectOption>
                        <NativeSelectOption value="uk"> teste2 </NativeSelectOption>
                        <NativeSelectOption value="ca"> teste3 </NativeSelectOption>
                      </NativeSelect>
                    </FormControl>
                    <FormDescription> Select a country </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
            <DialogFooter>
              <DialogClose as-child>
                <Button variant="outline"> Cancel </Button>
              </DialogClose>
              <Button type="submit"> Save changes </Button>
            </DialogFooter>
          </DialogContent>
        </form>
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
