<script setup lang="ts">
import { ref } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import api from '@/services/api'
import type { Product } from './columns'
import Field from '../ui/field/Field.vue'

const props = defineProps<{
  product: Product
  categories: { id: string; name: string }[]
}>()

const emit = defineEmits(['refresh'])

const isEditDialogOpen = ref(false)
const loading = ref(false)

// Estado do formulário pré-preenchido com os dados do produto
const form = ref({
  name: props.product.name,
  price: props.product.price,
  category_id: props.product.category.id
})

const handleUpdate = async () => {
  loading.value = true
  try {
    await api.put(`/product/${props.product.id}`, form.value)
    isEditDialogOpen.value = false
    emit('refresh') // Avisa a tabela para recarregar os dados
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Ações</DropdownMenuLabel>
      <DropdownMenuItem @click="isEditDialogOpen = true">
        Editar detalhes
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="text-destructive">Excluir produto</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog v-model:open="isEditDialogOpen">
    <DialogContent class="sm:max-w-[425px]">
      <form @submit.prevent="handleUpdate">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>Altere as informações do produto abaixo.</DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="edit-name">Nome</Label>
            <Input id="edit-name" v-model="form.name" required />
          </div>
          <div class="grid gap-2">
            <Label for="edit-price">Preço</Label>
            <Input id="edit-price" type="number" step="0.01" v-model="form.price" required />
          </div>
          <div class="grid gap-2">
            <Label>Categoria</Label>
            <NativeSelect v-bind="Field" v-model="form.category_id" required>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </NativeSelect>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
