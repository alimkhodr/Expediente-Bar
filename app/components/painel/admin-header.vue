<script setup lang="ts">
// Cabeçalho das páginas internas: título + descrição, ações extras (slot),
// atalhos para outras áreas do admin (`links`) e o botão "Sair".
// Usado dentro do UPageCard de cada página admin.
withDefaults(defineProps<{
  titulo: string
  descricao?: string
  /** Atalhos para outras áreas internas, exibidos como botões ghost antes de "Sair". */
  links?: { label: string, to: string, icon?: string }[]
}>(), {
  descricao: '',
  links: () => []
})

const { sair } = useSessaoAdmin()
</script>

<template>
  <div class="flex items-start justify-between gap-4 mb-6">
    <div class="min-w-0">
      <h2 class="text-xl font-semibold">
        {{ titulo }}
      </h2>
      <p
        v-if="descricao"
        class="text-sm text-muted mt-1"
      >
        {{ descricao }}
      </p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <slot />
      <UButton
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :icon="link.icon"
        :label="link.label"
        color="neutral"
        variant="ghost"
      />
      <UButton
        icon="i-lucide-log-out"
        color="neutral"
        variant="link"
        label="Sair"
        @click="sair"
      />
    </div>
  </div>
</template>
