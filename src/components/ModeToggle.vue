<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'

// O useColorMode gerencia automaticamente a classe .dark no <html>
const mode = useColorMode()

// Função simples para alternar entre 'light' e 'dark'
function toggleTheme() {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <Button variant="outline" size="icon" @click="toggleTheme">
    <Icon
      icon="radix-icons:sun"
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Icon
      icon="radix-icons:moon"
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Alternar tema</span>
  </Button>
</template>
