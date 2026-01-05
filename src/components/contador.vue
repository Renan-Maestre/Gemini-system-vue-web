<script setup lang="ts">
import { ref, watch } from 'vue'
import { Minus, Plus } from 'lucide-vue-next' // ou seus ícones de preferência

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits(['update:modelValue'])

const quantity = ref(props.modelValue)

// Função para validar e formatar a entrada
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  // Remove tudo que não for número
  let value = input.value.replace(/\D/g, '')

  // Converte para número e garante o mínimo de 1
  let numValue = parseInt(value)

  if (isNaN(numValue) || numValue < 1) {
    numValue = 1
  }

  quantity.value = numValue
  emit('update:modelValue', numValue)
}

const increment = () => {
  quantity.value++
  emit('update:modelValue', quantity.value)
}

const decrement = () => {
  if (quantity.value > 1) {
    quantity.value--
    emit('update:modelValue', quantity.value)
  }
}

// Sincroniza se o valor vier de fora (ex: reset do carrinho)
watch(() => props.modelValue, (newVal) => {
  quantity.value = newVal
})
</script>

<template>
  <div class="flex items-center gap-2 bg-[#1a1a1a] border border-zinc-800 rounded-md p-1 w-fit">
    <button
      @click="decrement"
      class="p-1 hover:bg-zinc-800 rounded text-zinc-400 disabled:opacity-30 transition-colors"
      :disabled="quantity <= 1"
    >
      <Minus class="w-4 h-4" />
    </button>

    <input
      type="text"
      :value="quantity"
      @input="handleInput"
      class="w-12 text-center bg-transparent text-white text-sm focus:outline-none"
    />

    <button
      @click="increment"
      class="p-1 hover:bg-zinc-800 rounded text-zinc-400 transition-colors"
    >
      <Plus class="w-4 h-4" />
    </button>
  </div>
</template>
