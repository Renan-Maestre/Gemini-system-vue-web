import { defineStore } from 'pinia'
import api from '@/services/api' // Certifique-se de importar sua instância do axios

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('user_token') || null,
    user: {
      name: localStorage.getItem('user_name') || '',
      email: localStorage.getItem('user_email') || '',
      avatar: localStorage.getItem('user_avatar') || null as string | null
    }
  }),

  actions: {
    // Apenas salva o token inicialmente
    setToken(token: string) {
      this.token = token
      localStorage.setItem('user_token', token)
    },

    // Busca os dados completos na rota protegida /api/me
    async fetchUser() {
      try {
        const response = await api.get('/me')
        const userData = response.data.data // Pega o objeto dentro da chave "data"

        this.user.name = userData.name
        this.user.email = userData.email
        this.user.avatar = userData.avatar

        localStorage.setItem('user_name', userData.name)
        localStorage.setItem('user_email', userData.email)
        if (userData.avatar) localStorage.setItem('user_avatar', userData.avatar)
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
        throw error // Repassa o erro para o componente tratar
      }
    },

    logout() {
      this.token = null
      this.user.name = ''
      this.user.email = ''
      localStorage.clear()
    }
  }
})
