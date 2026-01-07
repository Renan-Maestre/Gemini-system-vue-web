<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // 1. Pega apenas o token da URL enviado pelo Laravel
  const token = route.query.token as string

  if (token) {
    try {
      // 2. Salva o token (isso ativa o interceptor do Axios)
      authStore.setToken(token)

      // 3. Chama a sua nova rota /api/me para pegar os dados reais do banco
      await authStore.fetchUser()

      console.log('Sucesso: Usuário autenticado e perfil carregado.')
      await router.push('/home')
    } catch (error) {
      console.error('Erro ao buscar dados após login social:', error)
      await router.push('/login?error=fetch_failed')
    }
  } else {
    console.error('Falha na autenticação: Token não encontrado na URL')
    await router.push('/login?error=auth_failed')
  }
})
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center bg-background">
    <div class="flex flex-col items-center gap-4">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p class="text-muted-foreground animate-pulse">Finalizando login com Google...</p>
    </div>
  </div>
</template>
