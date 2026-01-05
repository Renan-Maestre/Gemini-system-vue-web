<script setup lang="ts">
import { ref, watch } from 'vue'
import { Minus, Plus } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits(['update:modelValue'])

const quantity = ref(props.modelValue)

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
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

watch(() => props.modelValue, (newVal) => {
  quantity.value = newVal
})
</script>

<template>
  <div class="flex items-center gap-1 bg-muted/50 border border-border rounded-lg p-0.5 w-fit shadow-sm">
    <button
      type="button"
      @click="decrement"
      class="p-1.5 hover:bg-background hover:text-foreground rounded-md text-muted-foreground disabled:opacity-20 transition-all active:scale-90"
      :disabled="quantity <= 1"
    >
      <Minus class="w-3.5 h-3.5" />
    </button>

    <input
      type="text"
      :value="quantity"
      @input="handleInput"
      class="w-10 text-center bg-transparent text-foreground text-sm font-bold focus:outline-none selection:bg-primary selection:text-primary-foreground"
    />

    <button
      type="button"
      @click="increment"
      class="p-1.5 hover:bg-background hover:text-foreground rounded-md text-muted-foreground transition-all active:scale-90"
    >
      <Plus class="w-3.5 h-3.5" />
    </button>
  </div>
</template>
