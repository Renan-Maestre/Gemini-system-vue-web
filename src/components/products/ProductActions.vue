<script setup lang="ts">
import { ref , watch } from 'vue'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  
} from '@/components/ui/alert-dialog'

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
console.log("Categorias recebidas na Dialog:", props.categories)
const emit = defineEmits(['refresh'])
const loading = ref(false)


const isEditDialogOpen = ref(false)


// Estado do formulário de edição
const form = ref({
  name: '',
  price: 0,
  category_id: '' as string | number
})

// Preenche o formulário quando o diálogo de edição é aberto
watch(isEditDialogOpen, (isOpen) => {
  if (isOpen) {
    form.value = {
      name: props.product.name,
      price: props.product.price,
      category_id: props.product.category.id
    }
  }
})

const handleUpdate = async () => {
  loading.value = true
  try {
    const payload = {
      nome: form.value.name,
      preco: form.value.price,
      categoria_id: form.value.category_id,
    }
    await api.put(`/product/${props.product.id}`, payload)
    isEditDialogOpen.value = false
    emit('refresh') // Avisa a tabela para recarregar os dados
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
  } finally {
    loading.value = false
  }
}

const isDeleteDialogOpen = ref(false)
const isDeleting = ref(false)         // Loading específico da exclusão

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await api.delete(`/product/${props.product.id}`)
    isDeleteDialogOpen.value = false
    emit('refresh') // Recarrega a tabela
  } catch (error) {
    console.error("Erro ao excluir produto:", error)
  } finally {
    isDeleting.value = false
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
      <DropdownMenuItem
        @click="isDeleteDialogOpen = true"
        class="text-destructive focus:text-destructive"
      >
        Excluir produto
      </DropdownMenuItem>
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

  <AlertDialog v-model:open="isDeleteDialogOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto
          <strong>{{ product.name }}</strong> do catálogo.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isDeleting">Cancelar</AlertDialogCancel>
        <AlertDialogAction
          @click.prevent="handleDelete"
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          :disabled="isDeleting"
        >
          {{ isDeleting ? 'Excluindo...' : 'Confirmar Exclusão' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
