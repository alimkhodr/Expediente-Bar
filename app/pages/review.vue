<script setup lang="ts">
/**
 * Placa de avaliação (NFC/QR): o cliente digita o nome dele (para a equipe achar a
 * avaliação no Google) e quem atendeu, salvamos o envio e abrimos a tela de avaliação do Google. Link da placa: /avaliar?utm_source=placa&utm_medium=nfc|qr
 */
definePageMeta({
  layout: 'blank',
  alias: ['/avaliar']
})

useSeoMeta({
  title: 'Avalie o Expediente Bar',
  robots: 'noindex, nofollow'
})

const route = useRoute()
const supabase = useSupabaseClient()
const { trackEvent } = useAnalytics()

const SAVE_TIMEOUT_MS = 2500

const customerName = ref('')
const waiterName = ref('')
const sending = ref(false)
const source = sourceFromMedium(route.query.utm_medium)

// Garçons mais citados por outros clientes viram botões (função do banco devolve só nomes de garçom)
const suggestions = ref<WaiterSuggestion[]>([])
const pickedSuggestion = ref(false)
const visibleSuggestions = computed(() => filterSuggestions(suggestions.value, waiterName.value))

onMounted(async () => {
  const { data } = await supabase.rpc('waiter_suggestions')
  suggestions.value = mergeSuggestions((data ?? []) as WaiterSuggestion[])
})

function pickWaiter (name: string) {
  waiterName.value = name
  pickedSuggestion.value = true
}

/** Salva o envio sem nunca travar o cliente: se o banco demorar ou falhar, segue para o Google. */
async function saveRequest (customer: string | null, waiter: string | null) {
  const insert = supabase.from('review_requests').insert({ customer_name: customer, waiter_name: waiter, source } as never)
  const timeout = new Promise(resolve => setTimeout(resolve, SAVE_TIMEOUT_MS))
  try {
    await Promise.race([insert, timeout])
  } catch {
    // o registro é secundário; a avaliação é o que importa
  }
}

async function goToReview (skipNames = false) {
  if (sending.value) return
  sending.value = true
  const customer = skipNames ? null : cleanName(customerName.value, CUSTOMER_NAME_MAX)
  const waiter = skipNames ? null : cleanName(waiterName.value, WAITER_NAME_MAX)
  // Nome do cliente fica só no Supabase (LGPD); no PostHog vai apenas se foi preenchido
  trackEvent('review_plaque_submit', {
    waiter_name: waiter,
    has_customer_name: !!customer,
    waiter_from_suggestion: !!waiter && pickedSuggestion.value,
    source
  })
  await saveRequest(customer, waiter)
  window.location.assign(links.review)
}
</script>

<template>
  <main class="flex min-h-[100svh] flex-col items-center justify-center bg-black px-6 py-12 text-center">
    <img
      src="/logo.svg"
      alt="Expediente Bar"
      width="476"
      height="151"
      class="h-12 w-auto"
    />

    <!-- SVG próprio: ícones lucide são máscara e não aceitam preenchimento -->
    <div
      class="mt-10 flex items-center gap-1 text-primary"
      aria-hidden="true"
    >
      <svg
        v-for="n in 5"
        :key="n"
        viewBox="0 0 24 24"
        class="size-7 fill-current"
      >
        <path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96z" />
      </svg>
    </div>

    <h1 class="mt-5 text-3xl font-bold text-white">
      Gostou do Expediente?
    </h1>
    <p class="mt-2 max-w-sm text-white/70">
      Sua avaliação no Google ajuda muito a gente. Antes, conta quem é você e quem te atendeu.
    </p>

    <form
      class="mt-8 flex w-full max-w-sm flex-col gap-4 text-left"
      @submit.prevent="goToReview()"
    >
      <UFormField
        label="Seu nome"
        help="Igual ao da sua conta Google, para acharmos sua avaliação."
        required
        :ui="{ label: 'text-white', help: 'text-white/60' }"
      >
        <UInput
          v-model="customerName"
          placeholder="Ex.: Ana Souza"
          size="xl"
          :maxlength="CUSTOMER_NAME_MAX"
          required
          autocomplete="name"
          autocapitalize="words"
          enterkeyhint="next"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Quem te atendeu?"
        :ui="{ label: 'text-white' }"
      >
        <UInput
          v-model="waiterName"
          placeholder="Nome do garçom"
          size="xl"
          :maxlength="WAITER_NAME_MAX"
          autocomplete="off"
          autocapitalize="words"
          enterkeyhint="go"
          class="w-full"
          @update:model-value="pickedSuggestion = false"
        />
        <div
          v-if="visibleSuggestions.length"
          role="group"
          aria-label="Garçons mais citados"
          class="mt-2 flex flex-wrap gap-2"
        >
          <UButton
            v-for="suggestion in visibleSuggestions"
            :key="suggestion.name"
            :label="suggestion.name"
            size="md"
            color="neutral"
            variant="subtle"
            class="rounded-full"
            @click="pickWaiter(suggestion.name)"
          />
        </div>
      </UFormField>
      <UButton
        type="submit"
        size="xl"
        block
        icon="i-simple-icons-google"
        :loading="sending"
        class="font-semibold"
      >
        Avaliar no Google
      </UButton>
      <UButton
        variant="link"
        color="neutral"
        :disabled="sending"
        class="self-center text-white/70"
        @click="goToReview(true)"
      >
        Avaliar sem informar nome
      </UButton>
      <p class="text-center text-xs text-white/60">
        Usamos seu nome só para encontrar sua avaliação e reconhecer quem te atendeu.
      </p>
    </form>
  </main>
</template>
