<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  User,
  Tag,
  ReceiptText,
  ChevronRight,
} from 'lucide-vue-next'

const paymentMethods = [
  { id: 'money', label: 'Dinheiro', icon: Banknote, color: 'text-green-500' },
  { id: 'pix', label: 'PIX', icon: QrCode, color: 'text-cyan-500' },
  { id: 'credit', label: 'Crédito', icon: CreditCard, color: 'text-blue-500' },
  { id: 'debit', label: 'Débito', icon: CreditCard, color: 'text-purple-500' },
]

const props = defineProps<{
  open: boolean
  subtotal: number
}>()

// Estados
const clientId = ref('0')
const discount = ref(0)
const selectedMethod = ref('money')
const amountToAdd = ref(0)
const payments = ref<Array<{ method: string; label: string; amount: number }>>([])
const inputRef = ref<any>(null)

const totalWithDiscount = computed(() => Math.max(0, props.subtotal - (discount.value || 0)))
const totalPaid = computed(() => payments.value.reduce((acc, p) => acc + p.amount, 0))
const remainingValue = computed(() => Math.max(0, totalWithDiscount.value - totalPaid.value))
const change = computed(() =>
  totalPaid.value > totalWithDiscount.value ? totalPaid.value - totalWithDiscount.value : 0,
)
const isFullyPaid = computed(
  () => totalPaid.value >= totalWithDiscount.value && totalWithDiscount.value > 0,
)

const emit = defineEmits(['update:open', 'confirm'])

watch(
  () => props.open,
  async (val) => {
    if (val) {
      payments.value = []
      discount.value = 0
      amountToAdd.value = totalWithDiscount.value
      await nextTick()
      const inputElement = inputRef.value?.$el?.querySelector('input') || inputRef.value?.$el
      inputElement?.focus()
    }
  },
)

// Validação para impedir desconto negativo
watch(discount, (newVal) => {
  if (newVal < 0) {
    discount.value = 0
  }
})

const addPayment = () => {
  if (amountToAdd.value <= 0) return
  const method = paymentMethods.find((m) => m.id === selectedMethod.value)
  payments.value.push({
    method: selectedMethod.value,
    label: method?.label || '',
    amount: amountToAdd.value,
  })
  amountToAdd.value = remainingValue.value
}

const removePayment = (index: number) => {
  payments.value.splice(index, 1)
  amountToAdd.value = remainingValue.value
}

const formatPrice = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

const handleFinalize = () => {
  if (!isFullyPaid.value) return
  emit('confirm', {
    clientId: clientId.value,
    discount: discount.value,
    payments: payments.value,
    total: totalWithDiscount.value,
    change: change.value,
  })
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent
      class="max-w-[95vw] lg:max-w-[1100px] p-0 overflow-hidden sm:rounded-2xl border-none shadow-2xl bg-background"
    >
      <div class="flex flex-col lg:flex-row h-full max-h-[90vh] lg:h-[680px]">
        <div
          class="w-full lg:w-[380px] bg-muted/30 p-6 lg:p-8 flex flex-col border-b lg:border-b-0 lg:border-r"
        >
          <div class="flex-1 space-y-6">
            <header class="hidden lg:block">
              <h2
                class="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1"
              >
                Operação de Venda
              </h2>
              <p class="text-2xl font-black italic text-primary uppercase">Finlaizar venda</p>
            </header>

            <div class="space-y-4">
              <div class="space-y-2">
                <Label class="text-[10px] font-bold uppercase flex items-center gap-2 opacity-60">
                  <User class="size-3" /> Identificar Cliente
                </Label>
                <Select v-model="clientId">
                  <SelectTrigger class="bg-card border-none shadow-sm h-11">
                    <SelectValue placeholder="Consumidor Final" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Consumidor Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div
                class="p-6 rounded-2xl bg-primary text-primary-foreground shadow-xl space-y-4 relative overflow-hidden"
              >
                <div class="relative z-10">
                  <p class="text-[10px] font-bold uppercase opacity-70 mb-1">Total Líquido</p>
                  <p
                    class="text-4xl lg:text-5xl font-black tracking-tighter leading-none font-mono"
                  >
                    {{ formatPrice(totalWithDiscount) }}
                  </p>
                </div>
                <div
                  class="flex justify-between items-center relative z-10 pt-2 border-t border-white/20"
                >
                  <div class="text-[10px] font-bold uppercase opacity-70 italic">
                    Bruto: {{ formatPrice(subtotal) }}
                  </div>
                  <div
                    v-if="discount > 0"
                    class="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded animate-in fade-in slide-in-from-top-1"
                  >
                    - {{ formatPrice(discount) }}
                  </div>
                </div>
                <ReceiptText class="absolute -right-4 -bottom-4 size-24 opacity-10 rotate-12" />
              </div>

              <div class="space-y-2">
                <Label class="text-[10px] font-bold uppercase flex items-center gap-1 opacity-60">
                  <Tag class="size-3" /> Aplicar Desconto (R$)
                </Label>
                <Input
                  type="number"
                  v-model.number="discount"
                  min="0"
                  class="bg-card border-none h-11 font-mono text-lg"
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>

          <div
            v-if="change > 0"
            class="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 animate-in zoom-in"
          >
            <p class="text-[10px] font-black uppercase mb-1">Troco</p>
            <p class="text-2xl font-black font-mono leading-none">{{ formatPrice(change) }}</p>
          </div>
        </div>

        <div class="flex-1 p-6 lg:p-8 flex flex-col bg-card overflow-hidden">
          <div class="flex-1 flex flex-col space-y-6">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                v-for="m in paymentMethods"
                :key="m.id"
                @click="selectedMethod = m.id"
                type="button"
                :class="[
                  'h-20 lg:h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all active:scale-95',
                  selectedMethod === m.id
                    ? 'border-primary bg-primary/5 shadow-inner'
                    : 'border-muted hover:border-primary/40',
                ]"
              >
                <component
                  :is="m.icon"
                  :class="['size-6 lg:size-7', selectedMethod === m.id ? 'text-primary' : m.color]"
                />
                <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-tighter">{{
                  m.label
                }}</span>
              </button>
            </div>

            <div
              class="bg-muted/40 p-1 rounded-2xl border flex align-center  sm:flex-row gap-1"
            >
              <div class="flex-1 px-4 py-2 ">
                <span class="text-[9px] font-black uppercase block mb-1">Valor do Pagamento</span>
                <div class="flex items-center gap-2">
                  <span class="text-xl font-bold">R$</span>
                  <Input
                    ref="inputRef"
                    type="number"
                    min="0"
                    v-model.number="amountToAdd"
                    class="text-3xl font-black border-none focus-visible:ring-0 bg-transparent h-10"
                    @keydown.enter="addPayment"
                  />
                </div>
              </div>
              <div  class="flex items-center mt-5">
                <Button
                  @click="addPayment"
                  class="px-8 py-4 sm:py-0 font-black uppercase rounded-xl h-10 "
                >
                  Lançar <ChevronRight class="ml-2 size-5" />
                </Button>
              </div>
            </div>

            <div class="flex-1 flex flex-col min-h-0">
              <Label
                class="text-[10px] font-black uppercase  mb-3 flex items-center gap-2 italic"
              >
                <ReceiptText class="size-3" /> Detalhes dos Recebimentos
              </Label>
              <ScrollArea class="flex-1 rounded-xl border bg-muted/10">
                <div class="p-3 space-y-2">
                  <div
                    v-for="(p, i) in payments"
                    :key="i"
                    class="flex justify-between items-center p-3 bg-card rounded-lg border shadow-sm hover:border-primary/50 transition-colors"
                  >
                    <div class="flex items-center gap-4">
                      <div class="size-8 rounded-full bg-muted flex items-center justify-center">
                        <component
                          :is="paymentMethods.find((m) => m.id === p.method)?.icon"
                          class="size-4 opacity-60"
                        />
                      </div>
                      <div>
                        <p class="text-[9px] font-bold uppercase opacity-40 leading-none">
                          {{ p.label }}
                        </p>
                        <p class="font-black text-base">{{ formatPrice(p.amount) }}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      @click="removePayment(i)"
                      class="size-9 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 class="size-4" />
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          <footer class="mt-6 pt-6 border-t">
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p
                  v-if="remainingValue > 0"
                  class="text-xs font-bold text-destructive uppercase "
                >
                  Falta pagar: {{ formatPrice(remainingValue) }}
                </p>
                <p
                  v-else
                  class="text-xs font-bold text-green-600 uppercase flex items-center gap-2"
                >
                  <span class="size-2 bg-green-500 rounded-full" /> Venda Liquidada
                </p>
              </div>

              <Button
                size="lg"
                class="w-full sm:w-64 h-16 text-xl font-black uppercase tracking-tighter shadow-2xl shadow-primary/20"
                :disabled="!isFullyPaid"
                @click="handleFinalize"
              >
                Finalizar (F10)
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
