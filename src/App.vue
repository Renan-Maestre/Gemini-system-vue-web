<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import ModeToggle from '@/components/ModeToggle.vue'
import { computed } from 'vue'


const route = useRoute()

// Escondemos a sidebar se for página pública (login/reg) 
const shouldHideSidebar = computed(() => {
  return route.meta.isPublic === true || route.meta.hideSidebar === true
})
</script>

<template>


  <SidebarProvider v-if="!shouldHideSidebar">
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">Sistema</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{{ route.name }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="ml-auto">
          <ModeToggle />
        </div>
      </header>

      <main class="p-6">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>

<div v-else class="min-h-screen bg-background relative transition-colors duration-300">
    <div v-if="route.meta.isPublic" class="absolute top-4 right-4 z-50">
      <ModeToggle />
    </div>
    <RouterView />
  </div>
</template>
