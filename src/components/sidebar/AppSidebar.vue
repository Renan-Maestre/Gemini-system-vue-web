<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  Command,
  LifeBuoy,
  Send,
  Settings2,

  ChartColumn,
  Package
} from "lucide-vue-next"

import NavMain from '@/components/sidebar/NavMain.vue'
import NavSecondary from '@/components/sidebar/NavSecondary.vue'
import NavUser from '@/components/sidebar/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'


const props = withDefaults(defineProps<SidebarProps>(), {
  variant: "inset",
  collapsible: "icon"

})


const data = {
  user: {
    name: "Renan Maestre",
    email: "Empresa@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/home",
      icon: ChartColumn,


    },
    {
      title: "Produtos",
      url: "",
      icon: Package,
      items: [
        {
          title: "Geral",
          url: "/products",
        },
        {
          title: "Relatórios",
          url: "#",
        },
        {
          title: "Categorias",
          url: "#",
        },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Geral",
          url: "#",
        },
        {
          title: "Equipe",
          url: "#",
        },
        {
          title: "Limites de Conta",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Supoerte",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],

}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">Gemini Vue system</span>
                <span class="truncate text-xs">Empresa</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
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
