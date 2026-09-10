<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const titulo = computed(() =>
  props.error.statusCode === 404 ? 'Página não encontrada' : 'Algo deu errado'
)

useSeoMeta({
  title: titulo,
  robots: 'noindex, nofollow'
})
</script>

<template>
  <UApp>
    <UError
      :error="{ ...error, statusMessage: titulo, message: 'O link pode ter mudado. Volte para a página inicial e encontre agenda, cardápio, eventos e reservas.' }"
      :clear="{ label: 'Voltar para o início', icon: 'i-lucide-house', size: 'xl' }"
      redirect="/"
      :ui="{ root: 'fundo-hero min-h-screen', statusCode: 'text-primary', statusMessage: 'text-2xl md:text-3xl' }"
    >
      <template #leading>
        <NuxtLink
          to="/"
          aria-label="Voltar para a página inicial do Expediente Bar"
          class="mb-6 inline-block"
        >
          <img
            src="/logo.svg"
            alt="Expediente Bar"
            width="476"
            height="151"
            class="h-14 w-[176px] md:h-20 md:w-[252px]"
          />
        </NuxtLink>
      </template>
    </UError>
  </UApp>
</template>
