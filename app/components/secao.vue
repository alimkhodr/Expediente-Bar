<script setup lang="ts">
/**
 * Seção padrão do site sobre o UPageSection / UPageHeader do Nuxt UI.
 * - `destaque` é a palavra em cor primária do título.
 * - `nivel="h1"` usa UPageHeader (páginas internas: cardápio, eventos).
 * - `largo` deixa o conteúdo em largura total; só o cabeçalho fica no container.
 */
const props = withDefaults(defineProps<{
  id: string
  destaque?: string
  titulo?: string
  descricao?: string
  contraste?: boolean
  centralizado?: boolean
  nivel?: 'h1' | 'h2'
  largo?: boolean
}>(), {
  destaque: undefined,
  titulo: undefined,
  descricao: undefined,
  contraste: false,
  centralizado: false,
  nivel: 'h2',
  largo: false
})

const temCabecalho = computed(() => Boolean(props.titulo || props.destaque))

const { trackEvent } = useAnalytics()
onMounted(() => {
  const el = document.getElementById(props.id)
  if (!el || !('IntersectionObserver' in window)) return
  const obs = new IntersectionObserver((entradas) => {
    if (entradas.some(e => e.isIntersecting)) {
      trackEvent('secao_vista', { secao: props.id })
      obs.disconnect()
    }
  }, { threshold: 0.4 })
  obs.observe(el)
  onUnmounted(() => obs.disconnect())
})
</script>

<template>
  <section
    :id="id"
    :aria-labelledby="temCabecalho ? `${id}-titulo` : undefined"
    class="relative"
    :class="[contraste ? 'bg-elevated/40' : '', largo ? 'pb-16 sm:pb-20' : '']"
  >
    <!-- Páginas internas: cabeçalho com h1 -->
    <UContainer
      v-if="nivel === 'h1'"
      class="py-12 sm:py-16"
    >
      <UPageHeader
        :ui="{ root: 'border-0 py-0', title: 'text-3xl sm:text-4xl lg:text-5xl', links: 'flex-wrap', headline: 'mb-4' }"
      >
        <template
          v-if="$slots.topo"
          #headline
        >
          <slot name="topo" />
        </template>
        <template #title>
          <span :id="`${id}-titulo`">
            <span
              v-if="destaque"
              class="text-primary italic"
            >{{ destaque }}</span>
            {{ titulo ? ` ${titulo}` : '' }}
          </span>
        </template>
        <template
          v-if="descricao"
          #description
        >
          {{ descricao }}
        </template>
        <template
          v-if="$slots.acoes"
          #links
        >
          <slot name="acoes" />
        </template>
      </UPageHeader>
      <div class="mt-8">
        <slot />
      </div>
    </UContainer>

    <!-- Seções da home: h2 -->
    <template v-else>
      <UPageSection
        as="div"
        :ui="{
          container: largo ? 'py-16 sm:py-16 lg:py-16 pb-0! gap-8' : 'py-16 sm:py-16 lg:py-16 gap-8',
          header: 'flex flex-col items-center text-center',
          title: 'text-3xl sm:text-4xl lg:text-5xl text-center',
          description: 'mx-auto text-center mb-5 mt-2',
          links: 'justify-center mt-4',
          body: 'mt-0 text-left'
        }"
      >
        <template
          v-if="temCabecalho"
          #title
        >
          <span :id="`${id}-titulo`">
            <span
              v-if="destaque"
              class="text-primary italic"
            >{{ destaque }}</span>
            {{ titulo ? ` ${titulo}` : '' }}
          </span>
        </template>
        <template
          v-if="descricao"
          #description
        >
          {{ descricao }}
        </template>
        <template
          v-if="$slots.acoes"
          #links
        >
          <slot name="acoes" />
        </template>
        <template
          v-if="!largo"
          #body
        >
          <slot />
        </template>
      </UPageSection>
      <div
        v-if="largo"
        class="mt-2"
      >
        <slot />
      </div>
    </template>
  </section>
</template>
