<script setup lang="ts">
import { ref, watch } from 'vue'
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
import { Checkbox } from '@/components/ui/checkbox'
import { NativeSelect } from '@/components/ui/native-select'
import api from '@/services/api'
import type { Product } from './columns'

const props = defineProps<{
  product: Product
  categories: any[]
}>()

const emit = defineEmits(['refresh'])
const loading = ref(false)
const isEditDialogOpen = ref(false)
const displayPrice = ref('')

// Estado do formulário de edição atualizado com todos os campos
const form = ref({
  name: '',
  description: '',
  price: 0,
  quantity: 1,
  category_id: '',
  status: true,
  image: null as string | null
})

// Função de formatação (mesma do data-table)
const formatToBRL = (val: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val)
}

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
  displayPrice.value = formatToBRL(numericValue)
}

// Preenche o formulário ao abrir a edição
watch(isEditDialogOpen, (isOpen) => {
  if (isOpen) {
    form.value = {
      name: props.product.name,
      description: props.product.description || '',
      price: props.product.price,
      quantity: props.product.quantity,
      category_id: props.product.category.uuid,
      status: props.product.status,
      image: props.product.image
    }
    displayPrice.value = formatToBRL(props.product.price)
  }
})

const handleUpdate = async () => {
  if (form.value.quantity < 1) return

  loading.value = true
  try {
    // Payload atualizado para inglês conforme solicitado
    const payload = {
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      quantity: form.value.quantity,
      category_id: form.value.category_id,
      status: form.value.status,
      image: form.value.image
    }

    // Usando o UUID do produto na URL se disponível, ou ID
    await api.put(`/product/${props.product.uuid || props.product.id}`, payload)

    isEditDialogOpen.value = false
    emit('refresh')
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
  } finally {
    loading.value = false
  }
}

const isDeleteDialogOpen = ref(false)
const isDeleting = ref(false)

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await api.delete(`/product/${props.product.uuid || props.product.id}`)
    isDeleteDialogOpen.value = false
    emit('refresh')
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
    <DialogContent class="sm:max-w-[500px]">
      <form @submit.prevent="handleUpdate">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>Altere as informações técnicas abaixo.</DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="edit-name">Nome</Label>
            <Input id="edit-name" v-model="form.name" minlength="3" required />
          </div>

          <div class="grid gap-2">
            <Label for="edit-description">Descrição</Label>
            <Input id="edit-description" v-model="form.description" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="edit-price">Preço</Label>
              <Input
                id="edit-price"
                type="text"
                :value="displayPrice"
                @input="handlePriceInput"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="edit-quantity">Quantidade</Label>
              <Input
                id="edit-quantity"
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
              <option v-for="cat in categories" :key="cat.uuid" :value="cat.uuid">
                {{ cat.name }}
              </option>
            </NativeSelect>
          </div>

          <div class="flex items-center space-x-2 pt-2">
            <Checkbox
              id="edit-status"
              :checked="form.status"
              @update:checked="form.status = $event"
              :default-value=true
            />
            <Label for="edit-status">Produto Ativo</Label>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" :disabled="loading || form.quantity < 1">
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
          <strong>{{ product.name }}</strong>.
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
