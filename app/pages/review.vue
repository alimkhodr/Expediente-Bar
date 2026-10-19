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
  trackEvent('review_plaque_submit', { waiter_name: waiter, has_customer_name: !!customer, source })
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

    <div class="mt-10 flex items-center gap-1 text-primary">
      <UIcon
        v-for="n in 5"
        :key="n"
        name="i-lucide-star"
        class="size-7 fill-current"
        aria-hidden="true"
      />
    </div>

    <h1 class="mt-5 text-3xl font-bold text-white">
      Gostou do Expediente?
    </h1>
    <p class="mt-2 max-w-sm text-white/70">
      Sua avaliação no Google ajuda muito a gente. Antes, conta quem é você e quem te atendeu hoje.
    </p>

    <form
      class="mt-8 flex w-full max-w-sm flex-col gap-4 text-left"
      @submit.prevent="goToReview()"
    >
      <UFormField
        label="Seu nome"
        hint="como aparece no Google"
        required
        :ui="{ label: 'text-white', hint: 'text-white/50' }"
      >
        <UInput
          v-model="customerName"
          placeholder="Ex.: Ana Souza"
          size="xl"
          :maxlength="CUSTOMER_NAME_MAX"
          required
          autocomplete="name"
          autocapitalize="words"
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
          class="w-full"
        />
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
        class="self-center text-white/60"
        @click="goToReview(true)"
      >
        Prefiro não informar
      </UButton>
      <p class="text-center text-xs text-white/40">
        Usamos seu nome só para encontrar sua avaliação e reconhecer quem te atendeu.
      </p>
    </form>
  </main>
</template>
