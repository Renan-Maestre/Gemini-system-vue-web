<script setup lang="ts">
import { ref, watch } from 'vue'
import { MoreHorizontal, SquarePen } from 'lucide-vue-next'
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
import api from '@/services/api'
import type { client as Client } from './columnsClients'

const props = defineProps<{
  client: Client
}>()

const fileInput = ref<HTMLInputElement | null>(null)


const emit = defineEmits(['refresh'])
const loading = ref(false)
const isEditDialogOpen = ref(false)


// Estado do formulário de edição atualizado com todos os campos
const form = ref({
  name: '',
  email: '',
  cpf_cnpj: '',
  phone: '',
  address: '',
  status: true,
})

// Preenche o formulário ao abrir a edição
watch(isEditDialogOpen, (isOpen) => {
  if (isOpen) {
    form.value = {
      name: props.client.name,
      email: props.client.email,
      cpf_cnpj: props.client.cpf_cnpj,
      phone: props.client.phone,
      address: props.client.address,
      status: props.client.status,
    }
  }
})

const handleUpdate = async () => {
  loading.value = true
  try {
    // Payload atualizado para inglês conforme solicitado
    const payload = {
      name: form.value.name,
      email: form.value.email,
      cpf_cnpj: form.value.cpf_cnpj,
      phone: form.value.phone,
      address: form.value.address,
      status: form.value.status,
    }

    // Usando o UUID do produto na URL se disponível, ou ID
    await api.put(`/clients/${props.client.uuid }`, payload)

    isEditDialogOpen.value = false
    emit('refresh')
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
  } finally {
    loading.value = false
  }
}

const isDeleteDialogOpen = ref(false)
const isDeleting = ref(false)

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await api.delete(`/clients/${props.client.uuid }`)
    isDeleteDialogOpen.value = false
    emit('refresh')
  } catch (error) {
    console.error("Erro ao excluir cliente:", error)
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
         <SquarePen class="mr-2 h-4 w-4" />
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

  <input
    type="file"
    ref="fileInput"
    class="hidden"
    accept="image/*"

  />

  <Dialog v-model:open="isEditDialogOpen">
    <DialogContent class="sm:max-w-125">
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
            <Label for="edit-email">Email</Label>
            <Input id="edit-email" v-model="form.email" type="email" required />
          </div>

          <div class="grid gap-2">
            <Label for="edit-cpf_cnpj">CPF/CNPJ</Label>
            <Input id="edit-cpf_cnpj" v-model="form.cpf_cnpj" minlength="11" required />
          </div>
          <div class="grid gap-2">
            <Label for="edit-phone">Telefone</Label>
            <Input id="edit-phone" v-model="form.phone" minlength="8" required />
          </div>
          <div class="grid gap-2">
            <Label for="edit-address">Endereço</Label>
            <Input id="edit-address" v-model="form.address" minlength="5" required />
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
          <strong>{{ client.name }}</strong>.
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
