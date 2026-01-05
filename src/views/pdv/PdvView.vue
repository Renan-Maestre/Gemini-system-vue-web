<template>
  <div class="flex flex-col h-screen bg-background">
    <header class="h-16 border-b flex items-center justify-between px-6 bg-card">
      <h1 class="text-xl font-bold italic text-primary"> PDV</h1>
      <Button variant="ghost" @click="$router.push('/home')">Sair do PDV</Button>
    </header>

    <main class="flex-1 flex overflow-hidden p-4 gap-4">
      <div class="flex-[2] bg-card rounded-xl border p-4">
        <Input placeholder="Buscar produto..." class="mb-4" />
        <div class="grid grid-cols-3 gap-4">
           <div v-for="i in 6" :key="i" class="h-32 bg-secondary rounded-lg border p-2 flex flex-col justify-end">
             <span class="text-sm font-medium">Produto {{ i }}</span>
             <span class="text-xs text-muted-foreground">R$ 45,00</span>
           </div>
        </div>
      </div>

      <div class="flex-1 bg-card rounded-xl border flex flex-col">
        <div class="p-4 border-b">
          <h2 class="font-semibold text-lg">Carrinho</h2>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <p class="text-center text-muted-foreground mt-10">Carrinho vazio</p>
        </div>
        <div class="p-4 bg-muted/50 border-t space-y-4">
          <div class="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>R$ 0,00</span>
          </div>
          <Button class="w-full size-lg text-lg">Finalizar Venda (F10)</Button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
</script>
