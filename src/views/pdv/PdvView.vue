<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, ShoppingCart, Package, LogOut, RefreshCw, SearchX } from 'lucide-vue-next'
import ModeToggle from '@/components/ModeToggle.vue'
import api from '@/services/api'

import type { Product } from '@/components/products/columns'
import Contador from '@/components/contador.vue'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

interface CategoryPDV {
  uuid: string
  name: string
}

// Interface para o item no carrinho
interface CartItem extends Product {
  cartQuantity: number
}

const loading = ref(true)
const isCaixaAberto = ref(true)
const products = ref<Product[]>([])
const categories = ref<CategoryPDV[]>([])
const cart = ref<CartItem[]>([])
const searchQuery = ref('')
const selectedCategory = ref('all')

const fetchPDVData = async () => {
  loading.value = true
  try {
    const [pRes, cRes] = await Promise.all([api.get('/product'), api.get('/category')])
    products.value = pRes.data.data

    categories.value = cRes.data.data.map((c: any) => ({
      uuid: c.uuid || c.id,
      name: c.name,
    }))
  } catch (error) {
    console.error('Erro ao carregar PDV:', error)
  } finally {
    loading.value = false
  }
}

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const searchLower = searchQuery.value.toLowerCase()

    const matchesSearch = p.name.toLowerCase().includes(searchLower)
    const matchesCategory =
      selectedCategory.value === 'all' || p.category?.uuid === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const cartTotal = computed(() =>
  cart.value.reduce((acc, item) => acc + item.price * item.cartQuantity, 0),
)

const addToCart = (product: Product) => {
  if (!isCaixaAberto.value) return
  const existing = cart.value.find((i) => i.uuid === product.uuid)
  if (existing) {
    existing.cartQuantity++
  } else {
    cart.value.push({ ...product, cartQuantity: 1 })
  }
}

const removeFromCart = (index: number) => cart.value.splice(index, 1)

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
}

const formatPrice = (val: number | string) => {
  const price = typeof val === 'string' ? parseFloat(val) : val
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price || 0)
}

onMounted(fetchPDVData)
</script>

<template>
  <div class="flex flex-col h-screen bg-background text-foreground overflow-hidden">
    <header class="h-16 border-b flex items-center justify-between px-6 bg-card shrink-0">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-black italic text-primary tracking-tighter">PDV - Gemini</h1>
        <Badge
          :variant="isCaixaAberto ? 'default' : 'destructive'"
          class="px-3 py-1 uppercase text-[10px] tracking-widest"
        >
          {{ isCaixaAberto ? 'Caixa Aberto' : 'Caixa Fechado' }}
        </Badge>
      </div>

      <div class="flex items-center gap-4">
        <div class="text-right hidden md:block">
          <p class="text-[10px] text-muted-foreground uppercase font-bold">Operador</p>
          <p class="text-sm font-medium">Renan Maestre</p>
        </div>
        <Separator orientation="vertical" class="h-8" />
        <ModeToggle />
        <Button
          variant="destructive"
          size="icon"
          @click="$router.push('/home')"
          title="Sair do PDV"
        >
          <LogOut class="size-5" />
        </Button>
      </div>
    </header>

    <section class="p-4 bg-muted/30 border-b flex flex-wrap gap-4 items-center justify-between">
      <div class="flex flex-1 gap-4 min-w-75">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            placeholder="Buscar por nome..."
            class="pl-10 h-11 bg-card shadow-sm"
          />
        </div>

        <Select v-model="selectedCategory">
          <SelectTrigger class="w-55 h-11 bg-card shadow-sm">
            <SelectValue placeholder="Todas as Categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filtrar por Categoria</SelectLabel>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              <SelectItem v-for="cat in categories" :key="cat.uuid" :value="cat.uuid">
                {{ cat.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="flex gap-2">
        <Button variant="outline" class="h-11 gap-2" @click="fetchPDVData">
          <RefreshCw class="size-4" :class="{ 'animate-spin': loading }" />
          Sincronizar
        </Button>
      </div>
    </section>

    <main class="flex-1 flex overflow-hidden p-4 gap-4 bg-muted/10">
      <div class="flex-3 overflow-y-auto pr-2 custom-scrollbar">
        <div
          v-if="loading"
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <Skeleton v-for="i in 15" :key="i" class="h-48 rounded-xl" />
        </div>

        <div
          v-else-if="filteredProducts.length > 0"
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ml-2"
        >
          <Card
            v-for="product in filteredProducts"
            :key="product.uuid"
            class="mt-2 group cursor-pointer p-0 overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-primary hover:shadow-lg active:scale-[0.98] border-none"
            @click="addToCart(product)"
          >
            <div class="aspect-square bg-muted relative flex items-center justify-center border-b">
              <img
                v-if="product.image"
                :src="baseURL + product.image"
                class="object-cover size-full group-hover:scale-110 transition-transform duration-300"
              />
              <Package v-else class="size-12 text-muted-foreground/30" />
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <Plus class="text-white size-8" />
              </div>
            </div>
            <CardContent class="p-3 flex-1 flex flex-col justify-between bg-card">
              <div>
                <p class="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                  {{ product.category?.name || 'Geral' }}
                </p>
                <h3 class="font-bold text-sm leading-tight line-clamp-2 uppercase">
                  {{ product.name }}
                </h3>
              </div>
              <p class="mt-3 text-lg font-black tracking-tight">{{ formatPrice(product.price) }}</p>
            </CardContent>
          </Card>
        </div>

        <div
          v-else
          class="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50"
        >
          <SearchX class="size-16 mb-4" />
          <p class="text-xl font-medium">Nenhum produto encontrado</p>
          <Button variant="link" @click="clearFilters">Limpar filtros</Button>
        </div>
      </div>

      <aside
        class="flex-1 bg-card rounded-xl border-2 flex flex-col shadow-2xl overflow-hidden max-w-100"
      >
        <div class="p-4 border-b bg-muted/20 flex items-center justify-between">
          <h2 class="font-black text-lg uppercase flex items-center gap-2">
            <ShoppingCart class="size-5" /> Itens
          </h2>
          <Badge variant="secondary" class="font-mono">{{ cart.length }}</Badge>
        </div>

        <div class="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <div
            v-for="(item, index) in cart"
            :key="item.uuid"
            class="py-4 border-b last:border-0 flex gap-3 group"
          >
            <div class="flex gap-4">
    <div class="relative size-16 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-zinc-800 flex items-center justify-center">
      <img v-if="item.image" :src="baseURL + item.image" class="size-full object-cover shadow-sm" />
      <Package v-else class="size-6 text-zinc-700" />
    </div>
            </div>

            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-bold truncate uppercase">{{ item.name }}</h4>
              <p class="text-xs text-muted-foreground italic">{{ formatPrice(item.price) }} / un</p>
              <Contador v-model="item.cartQuantity" />
            </div>
            <div class="text-right flex flex-col justify-between items-end">
              <span class="font-bold text-sm">{{
                formatPrice(item.price * item.cartQuantity)
              }}</span>
              <button
                @click="removeFromCart(index)"
                class="text-destructive hover:underline text-[10px] font-bold uppercase"
              >
                Excluir
              </button>
            </div>
          </div>

          <div v-if="cart.length === 0" class="py-20 text-center opacity-30">
            <ShoppingCart class="size-12 mx-auto mb-2" />
            <p class="text-xs font-bold uppercase">Carrinho Vazio</p>
          </div>
        </div>

        <div class="p-6 bg-primary text-primary-foreground space-y-4">
          <div class="space-y-1">
            <div class="flex justify-between text-xs opacity-80 uppercase font-bold">
              <span>Subtotal</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>
            <div class="flex justify-between text-3xl font-black tracking-tighter">
              <span>TOTAL</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>
          </div>

          <Button
            class="w-full h-16 text-xl font-black bg-white text-primary hover:bg-zinc-100 shadow-xl"
            :disabled="cart.length === 0 || !isCaixaAberto"
          >
            PAGAMENTO (F10)
          </Button>
        </div>
      </aside>
    </main>
  </div>
</template>
