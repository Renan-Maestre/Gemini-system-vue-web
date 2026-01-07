<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { isAxiosError } from 'axios'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-vue-next'

import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore()

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // 1. Faz a chamada à API
    const response = await api.post('/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
    })

    authStore.setToken(response.data.token)

    await authStore.fetchUser()
    await router.push('/home')
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || 'Erro no registro.'
    } else {
      errorMessage.value = 'Ocorreu um erro inesperado.'
    }
    console.error('Erro no registro:', error)
  } finally {
    loading.value = false
  }
}

const loginWithGoogle = async () => {
  // Redirecionar para o endpoint de login do Google
  window.location.href = 'http://localhost/api/auth/google'
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form @submit.prevent="handleSubmit" class="p-6 md:p-8">
          <FieldGroup>
            <div class="flex flex-col items-center gap-2 text-center">
              <h1 class="text-2xl font-bold">Crie sua conta</h1>
              <p class="text-muted-foreground text-sm text-balance">
                Insira seu e-mail abaixo para criar sua conta.
              </p>
            </div>
            <Field>
              <FieldLabel for="name"> Nome </FieldLabel>
              <Input
                id="name"
                v-model="name"
                type="text"
                placeholder="Seu nome completo"
                required
              />
            </Field>

            <Field>
              <FieldLabel for="email"> Email </FieldLabel>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="email@example.com"
                required
              />
              <FieldDescription>
                Usaremos este endereço de e-mail para entrar em contato com você.
              </FieldDescription>
            </Field>

            <Field class="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel for="password">Senha</FieldLabel>
                <div class="relative">
                  <Input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="pr-10"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <EyeOff v-if="!showPassword" class="size-4" />
                    <Eye v-else class="size-4" />
                  </button>
                </div>
              </Field>

              <Field>
                <FieldLabel for="confirm-password">Confirmar Senha</FieldLabel>
                <div class="relative">
                  <Input
                    id="confirm-password"
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="pr-10"
                    required
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <EyeOff v-if="!showConfirmPassword" class="size-4" />
                    <Eye v-else class="size-4" />
                  </button>
                </div>
              </Field>
            </Field>

            <Field>
              <Button type="submit" :disabled="loading" class="w-full">
                {{ loading ? 'Processando...' : 'Criar conta' }}
              </Button>
            </Field>

            <FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">
              Ou continue com
            </FieldSeparator>

            <Field class="">
              <Button
                @click="loginWithGoogle"
                variant="outline"
                type="button"
                class="google-btn-animated relative flex items-center justify-center py-6 w-full transition-all border-2 text-black dark:text-white bg-white dark:bg-zinc-800 [--inner-bg:white] dark:[--inner-bg:#27272a]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 mr-2">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span class="font-semibold">Entrar com Google</span>
              </Button>
            </Field>

            <FieldDescription class="text-center">
              Já tem uma conta?
              <RouterLink to="/login" class="ml-1 underline offset-2 hover:no-underline">
                Log in
              </RouterLink>
            </FieldDescription>
          </FieldGroup>
        </form>

        <div class="bg-muted relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1508780709619-79562169bc64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Image"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
    <FieldDescription class="px-6 text-center">
      Ao clicar em entrar, você concorda com nossos <a href="#">Termos de Serviço</a> e
      <a href="#">Política de Privacidade</a>.
    </FieldDescription>
  </div>
</template>


<style scoped>
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.google-btn-animated {
  --g-blue: #4285f4;
  --g-red: #ea4335;
  --g-yellow: #fbbc05;
  --g-green: #34a853;

  /* Não definimos --inner-bg aqui, ele vem do HTML acima! */
}

.google-btn-animated:hover {
  /* No hover, forçamos a borda transparente e aplicamos o gradiente */
  border-color: transparent !important;

  background-image:
    linear-gradient(var(--inner-bg), var(--inner-bg)),
    conic-gradient(
      from var(--angle),
      var(--g-blue),
      var(--g-red),
      var(--g-yellow),
      var(--g-green),
      var(--g-blue)
    );

  background-origin: border-box;
  background-clip: padding-box, border-box;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}
</style>
