<script setup lang="ts">
import { useRouter } from 'vue-router' //
import api from '@/services/api'
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const name = localStorage.getItem('user_name')
const email = localStorage.getItem('user_email')

const props = defineProps<{
  user: {
    name: string
    email: string
  }
}>()
const { isMobile } = useSidebar()
const router = useRouter()

async function handleLogout() {
  try {
    await api.post('/logout')
  } catch (error) {
    console.error('Erro ao invalidar token no servidor:', error)
  } finally {

    localStorage.removeItem('user_token')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_email')

    
    router.push('/login')
  }
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/155326901?v=4"
                alt="Foto do Usuário"
              />
              <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ name }}</span>
              <span class="truncate text-xs">{{ email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/155326901?v=4"
                  alt="Foto do Usuário"
                />
                <AvatarFallback class="rounded-lg"> RN </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ name }}</span>
                <span class="truncate text-xs">{{ email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles />
              Upgrade para Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck />
              Conta
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              Pagamentos
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Nottificações
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout" class="cursor-pointer">
            <LogOut />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
