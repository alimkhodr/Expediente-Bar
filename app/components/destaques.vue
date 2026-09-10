<script setup lang="ts">
import type { Destaque } from '~/types/conteudo'

defineProps<{ destaques: Destaque[] }>()
const { trackEvent } = useAnalytics()
const externo = (url: string) => /^https?:\/\//.test(url)
</script>

<template>
  <Secao
    id="destaques"
    destaque="Vem"
    titulo="pro Expediente"
    descricao="Aniversário, pagode ou aquela porção em casa: escolhe o seu jeito de curtir."
  >
    <UPageGrid class="gap-5 lg:grid-cols-3">
      <UPageCard
        v-for="item in destaques"
        :key="item.id"
        :title="item.titulo"
        :description="item.texto"
        :icon="item.icone"
        variant="subtle"
        highlight
        highlight-color="primary"
        :ui="{
          root: 'group rounded-xl overflow-hidden ring-white/10',
          container: 'p-0 sm:p-0 gap-0',
          wrapper: 'p-6 pt-0 items-stretch',
          header: 'mb-6 -mx-6 aspect-[3/2] overflow-hidden',
          leading: 'mb-3',
          leadingIcon: 'size-6',
          title: 'text-2xl',
          description: 'text-sm text-muted',
          footer: 'pt-5'
        }"
      >
        <template #header>
          <NuxtImg
            :src="item.imagem"
            :alt="item.titulo"
            width="720"
            height="480"
            sizes="xs:100vw sm:50vw lg:33vw"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </template>
        <template #footer>
          <UButton
            :to="item.url"
            :target="externo(item.url) ? '_blank' : undefined"
            :rel="externo(item.url) ? 'noopener noreferrer' : undefined"
            color="primary"
            size="lg"
            class="font-semibold"
            :trailing-icon="externo(item.url) ? 'i-lucide-arrow-up-right' : 'i-lucide-arrow-right'"
            @click="trackEvent('destaque_click', { id: item.id, botao: item.botao })"
          >
            {{ item.botao }}
          </UButton>
        </template>
      </UPageCard>
    </UPageGrid>
  </Secao>
</template>
