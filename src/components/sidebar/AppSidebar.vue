<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {

  LifeBuoy,
  Send,
  Settings2,
  ChartColumn,
  Package,
  Building2,
  CircleDollarSign
} from 'lucide-vue-next'

import NavMain from '@/components/sidebar/NavMain.vue'
import NavSecondary from '@/components/sidebar/NavSecondary.vue'
import NavUser from '@/components/sidebar/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import SystemSwitcher from './SystemSwitcher.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'inset',
  collapsible: 'icon',
})

const data = {
  user: {
    name: 'Renan Maestre',
    email: 'Empresa@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  system: [
    {
      name: 'ERP - Gemini',
      logo: Building2,
      type: 'Gestão Empresarial',
    },
    {
      name: 'PDV - Gemini',
      logo: CircleDollarSign,
      type: 'vendas e pagamentos',
    }

  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/home',
      icon: ChartColumn,
    },
    {
      title: 'Produtos',
      url: '#',
      icon: Package,
      items: [
        {
          title: 'Geral',
          url: '/products',
        },
        {
          title: 'Relatórios',
          url: '#',
        },
        {
          title: 'Categorias',
          url: '/categories',
        },
      ],
    },
    {
      title: 'Configurações',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Geral',
          url: '#',
        },
        {
          title: 'Equipe',
          url: '#',
        },
        {
          title: 'Limites de Conta',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Supoerte',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SystemSwitcher :system="data.system" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />

      <NavSecondary :items="data.navSecondary" class="mt-auto" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>
