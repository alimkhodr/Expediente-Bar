<script setup lang="ts" generic="T extends { id: string }">
/**
 * Lista de itens com mover para cima/baixo, remover e adicionar.
 * O conteúdo de cada item vem do slot padrão.
 */
const itens = defineModel<T[]>({ required: true })

const props = defineProps<{
  novo: () => T
  rotuloAdicionar?: string
  titulo?: (item: T, indice: number) => string
}>()

function mover (indice: number, delta: number) {
  const alvo = indice + delta
  if (alvo < 0 || alvo >= itens.value.length) return
  const copia = [...itens.value]
  const [item] = copia.splice(indice, 1)
  copia.splice(alvo, 0, item!)
  itens.value = copia
}

function remover (indice: number) {
  itens.value = itens.value.filter((_, i) => i !== indice)
}

function adicionar () {
  itens.value = [...itens.value, props.novo()]
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <UCard
      v-for="(item, indice) in itens"
      :key="item.id"
      :ui="{ body: 'p-4 sm:p-5' }"
    >
      <template #header>
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm font-semibold text-muted">
            {{ props.titulo ? props.titulo(item, indice) : `Item ${indice + 1}` }}
          </p>
          <div class="flex items-center gap-1">
            <UButton
              icon="i-lucide-chevron-up"
              size="xs"
              color="neutral"
              variant="ghost"
              aria-label="Mover para cima"
              :disabled="indice === 0"
              @click="mover(indice, -1)"
            />
            <UButton
              icon="i-lucide-chevron-down"
              size="xs"
              color="neutral"
              variant="ghost"
              aria-label="Mover para baixo"
              :disabled="indice === itens.length - 1"
              @click="mover(indice, 1)"
            />
            <UButton
              icon="i-lucide-trash-2"
              size="xs"
              color="error"
              variant="ghost"
              aria-label="Remover"
              @click="remover(indice)"
            />
          </div>
        </div>
      </template>
      <slot
        :item="item"
        :indice="indice"
      />
    </UCard>
    <UButton
      icon="i-lucide-plus"
      color="neutral"
      variant="outline"
      class="self-start"
      @click="adicionar"
    >
      {{ rotuloAdicionar ?? 'Adicionar' }}
    </UButton>
  </div>
</template>
