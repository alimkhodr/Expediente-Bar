<script setup>
import QRCode from 'qrcode.vue'

definePageMeta({
  layout: 'blank'
})

const supabase = useSupabaseClient()

const senhaAtual = ref(null)
const historico = ref([])
const animating = ref(false)

async function carregarSenhas () {
  const { data } = await supabase
    .from('senhas')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(4)

  if (data && data.length > 0) {
    const novaSenha = data[0]

    // Só anima se for uma senha diferente
    if (senhaAtual.value && novaSenha.id !== senhaAtual.value.id) {
      animating.value = true
      setTimeout(() => { animating.value = false }, 600)
    }

    senhaAtual.value = novaSenha
    historico.value = data.slice(1)
  }
}

let channel = null

onMounted(() => {
  carregarSenhas()

  channel = supabase
    .channel('senhas-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'senhas'
    }, (payload) => {
      console.log('Senha atualizada:', payload)
      carregarSenhas()
    })
    .subscribe((status) => {
      console.log('Status do canal:', status)
    })
})

onUnmounted(() => {
  if (channel) {
    supabase.removeChannel(channel)
  }
})

const currentUrl = computed(() => {
  if (import.meta.client) return window.location.href
  return ''
})
</script>

<template>
  <div class="min-h-screen h-full w-full p-6 lg:p-16 flex flex-col items-start justify-center gap-4 lg:gap-8">
    <header class="w-full flex flex-row items-center justify-between">
      <div class="w-full flex flex-col lg:flex-row items-start justify-start lg:items-center gap-6 lg:gap-8">
        <Logo class="h-8 lg:h-18" />
        <h1 class="text-4xl lg:text-7xl text-center">
          Painel de Senhas
        </h1>
      </div>
      <div class="hidden lg:flex flex-row items-center shrink-0">
        <div class="max-w-62">
          <span class="text-4xl">Acompanhe pelo celular</span>
        </div>
        <UCard
          :ui="{ body: 'p-2 sm:p-2' }"
          class="overflow-visible"
        >
          <QRCode
            :value="currentUrl"
            :size="140"
            level="H"
          />
        </UCard>
      </div>
    </header>

    <div
      v-if="!senhaAtual"
      class="h-full flex items-center"
    >
      <UCard>
        <span class="text-4xl">Nenhuma senha gerada ainda</span>
      </UCard>
    </div>

    <div
      v-else
      class="grid grid-flow-row-dense grid-cols-3 grid-rows-6 lg:grid-rows-3 gap-6 h-full w-full"
    >
      <UCard
        class="row-span-3 flex items-center justify-center col-span-3 lg:col-span-2 overflow-hidden"
      >
        <span
          :key="senhaAtual?.id"
          :class="['text-8xl sm:text-[300px] 2xl:text-[450px] font-bold text-primary senha-entrada', { 'senha-flip': animating }]"
        >
          {{ String(senhaAtual?.numero ?? 0).padStart(3, '0') }}
        </span>
      </UCard>

      <UCard
        v-for="(s, index) in historico"
        :key="s.id"
        class="flex items-center justify-center col-span-3 lg:col-span-1 overflow-hidden"
      >
        <span
          :class="['text-6xl xl:text-9xl font-bold historico-item']"
          :style="{ animationDelay: `${index * 60}ms` }"
        >
          {{ String(s.numero).padStart(3, '0') }}
        </span>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.senha-entrada {
  display: inline-block;
}

.senha-flip {
  animation: senhaFlip 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes senhaFlip {
  0%   { transform: translateY(60px) scaleY(0.7); opacity: 0; }
  60%  { transform: translateY(-12px) scaleY(1.04); opacity: 1; }
  80%  { transform: translateY(6px) scaleY(0.98); }
  100% { transform: translateY(0) scaleY(1); opacity: 1; }
}

.historico-item {
  animation: slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slideIn {
  from { transform: translateX(-20px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
</style>
