<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue"
import { useRouter } from "vue-router";
import  api  from "@/services/api";
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { isAxiosError } from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'


const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('token', response.data.token)

    // Redireciona para a home após o sucesso
    router.push('/home')
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || 'Falha na autenticação.'
    } else {
      errorMessage.value = 'Ocorreu um erro inesperado no sistema.'
    }
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form @submit.prevent="handleSubmit" class="p-6 md:p-8">
          <FieldGroup>
            <div class="flex flex-col items-center gap-2 text-center">
              <h1 class="text-2xl font-bold">Bem vindo de volta!</h1>
              <p class="text-muted-foreground text-balance">Faça login com sua conta</p>
            </div>

            <Field>
              <FieldLabel for="email">Email</FieldLabel>
              <Input id="email" v-model="email" type="email" placeholder="email@example.com" required />
            </Field>

            <Field>
              <div class="flex items-center">
                <FieldLabel for="password">Senha</FieldLabel>
                <a href="#" class="ml-auto text-sm underline-offset-2 hover:underline">esqueceu a senha?</a>
              </div>
              <Input id="password" v-model="password" type="password" required />
            </Field>

            <Field>
              <Button type="submit" :disabled="loading" class="w-full">
                {{ loading ? 'Processando...' : 'Entrar' }}
              </Button>
            </Field>

            <p v-if="errorMessage" class="text-destructive text-sm text-center font-medium">
              {{ errorMessage }}
            </p>

            <FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">Ou continue com</FieldSeparator>

            <Field class="grid grid-cols-3 gap-4">
               </Field>

            <FieldDescription class="text-center">
              Novo por aqui?
              <RouterLink to="/register" class="ml-1 underline offset-2 hover:no-underline">
                Crie uma conta
              </RouterLink>
            </FieldDescription>
          </FieldGroup>
        </form>
        <div class="bg-muted relative hidden md:block">
          <img src="https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=60" alt="Image" class="absolute inset-0 h-full w-full object-cover">
        </div>
      </CardContent>
    </Card>
    </div>
</template>
