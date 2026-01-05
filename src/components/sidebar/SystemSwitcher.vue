<script setup lang="ts">
import type { Component } from "vue"

import { ChevronsUpDown} from "lucide-vue-next"
import { ref } from "vue"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface System {
  name: string
  logo: Component
  type: string
}

const props = defineProps<{
  system: System[]
}>()

const { isMobile } = useSidebar()
const activeSystem = ref(props.system[0]!)
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            v-if="activeSystem"
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <component :is="activeSystem.logo" class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">
                {{ activeSystem.name }}
              </span>
              <span class="truncate text-xs">{{ activeSystem.type }}</span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            System
          </DropdownMenuLabel>
          <DropdownMenuItem
            v-for="(team) in system"
            :key="team.name"
            class="gap-2 p-2"
            @click="activeSystem = team"
          >
            <div class="flex size-6 items-center justify-center rounded-sm border">
              <component :is="team.logo" class="size-3.5 shrink-0" />
            </div>
            {{ team.name }}

          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
