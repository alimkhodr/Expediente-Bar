<script setup lang="ts">
/**
 * Placa de avaliação (NFC/QR): o cliente digita quem atendeu, salvamos o envio
 * e abrimos a tela de avaliação do Google. Link da placa: /avaliar?utm_source=placa&utm_medium=nfc|qr
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

const waiterName = ref('')
const sending = ref(false)
const source = sourceFromMedium(route.query.utm_medium)

/** Salva o envio sem nunca travar o cliente: se o banco demorar ou falhar, segue para o Google. */
async function saveRequest (name: string | null) {
  const insert = supabase.from('review_requests').insert({ waiter_name: name, source } as never)
  const timeout = new Promise(resolve => setTimeout(resolve, SAVE_TIMEOUT_MS))
  try {
    await Promise.race([insert, timeout])
  } catch {
    // o registro é secundário; a avaliação é o que importa
  }
}

async function goToReview (skipName = false) {
  if (sending.value) return
  sending.value = true
  const name = skipName ? null : cleanWaiterName(waiterName.value)
  trackEvent('review_plaque_submit', { waiter_name: name, source })
  await saveRequest(name)
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
      Sua avaliação no Google ajuda muito a gente. Antes, conta quem te atendeu hoje.
    </p>

    <form
      class="mt-8 flex w-full max-w-sm flex-col gap-3"
      @submit.prevent="goToReview()"
    >
      <UFormField
        label="Quem te atendeu?"
        :ui="{ label: 'text-white text-left w-full' }"
      >
        <UInput
          v-model="waiterName"
          placeholder="Nome do garçom"
          size="xl"
          maxlength="60"
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
        Não lembro, pular
      </UButton>
    </form>
  </main>
</template>
