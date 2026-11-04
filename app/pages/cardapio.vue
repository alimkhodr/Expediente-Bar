<script setup lang="ts">
// Cardápio de novembro/2026: cada página do PDF (A4 paisagem) cortada ao meio.
// Pasta com data para o navegador não mostrar a versão antiga do cache (/images fica 7 dias em cache).
const paginas = [
  { src: '/images/cardapio/2026-11/pagina-1.webp', largura: 1414, altura: 2000, titulo: 'Cardápio – porções e lanches' },
  { src: '/images/cardapio/2026-11/pagina-2.webp', largura: 1414, altura: 2000, titulo: 'Cardápio – bolinhos, sobremesas, sucos e bebidas' },
  { src: '/images/cardapio/2026-11/pagina-3.webp', largura: 1414, altura: 2000, titulo: 'Cardápio – caipirinhas, doses e gin' },
  { src: '/images/cardapio/2026-11/pagina-4.webp', largura: 1414, altura: 2000, titulo: 'Cardápio – cervejas, long drinks, drinks e combos' }
]

const descricao = 'Cardápio completo do Expediente Bar em São José dos Campos: porções, petiscos, lanches, cervejas, drinks e doses. Veja com zoom direto no celular.'

usePaginaSeo({
  titulo: 'Cardápio',
  descricao,
  caminho: '/cardapio',
  imagem: '/images/cardapio/2026-11/og.jpg',
  imagemAlt: 'Cardápio do Expediente Bar com porções, bolinhos, sobremesas e bebidas'
})

useSchemaOrg([
  schemaPagina('/cardapio', 'Cardápio · Expediente Bar', descricao),
  schemaBreadcrumb([{ nome: 'Início', caminho: '/' }, { nome: 'Cardápio', caminho: '/cardapio' }]),
  {
    '@type': 'Menu',
    '@id': `${useRuntimeConfig().public.siteUrl}/cardapio#menu`,
    name: 'Cardápio do Expediente Bar',
    description: descricao,
    inLanguage: 'pt-BR',
    image: paginas.map(p => `${useRuntimeConfig().public.siteUrl}${p.src}`),
    // Itens e preços em texto: as imagens do cardápio não são lidas como texto pelo Google
    hasMenuSection: menuSchemaSections()
  }
])

const breadcrumb = [
  { label: 'Início', to: '/', icon: 'i-lucide-house' },
  { label: 'Cardápio', to: '/cardapio' }
]
</script>

<template>
  <div class="pt-16">
    <Secao
      id="cardapio"
      nivel="h1"
      destaque="Cardápio"
      descricao="Porções, lanches, cervejas e drinks. Toque em uma página para ampliar e dar zoom."
    >
      <template #topo>
        <UBreadcrumb :items="breadcrumb" />
      </template>

      <CardapioViewer :paginas="paginas" />

      <!-- Versão em texto (fica no HTML mesmo fechada, para busca e leitores de tela) -->
      <details class="group mx-auto mt-10 max-w-3xl rounded-sm border border-default">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
          Ver cardápio em texto
          <UIcon
            name="i-lucide-chevron-down"
            class="size-5 shrink-0 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div class="grid grid-cols-1 gap-8 border-t border-default px-5 py-6 sm:grid-cols-2">
          <section
            v-for="section in menuSections"
            :key="section.name"
            class="min-w-0"
          >
            <h2 class="text-lg font-semibold text-highlighted">
              {{ section.name }}
            </h2>
            <p
              v-if="section.description"
              class="text-sm text-muted"
            >
              {{ section.description }}
            </p>
            <ul class="mt-2 divide-y divide-default">
              <li
                v-for="item in section.items"
                :key="item.name"
                class="py-2"
              >
                <div class="flex items-baseline justify-between gap-3">
                  <span>{{ item.name }}</span>
                  <span class="shrink-0 font-semibold tabular-nums text-primary">{{ formatMenuPrice(item.price) }}</span>
                </div>
                <p
                  v-if="item.description"
                  class="text-sm text-muted"
                >
                  {{ item.description }}
                </p>
              </li>
            </ul>
          </section>
        </div>
      </details>

      <p class="mt-10 text-center text-xs text-muted">
        Preços e itens podem mudar sem aviso. Aceitamos cartões, Pix e vales-refeição (VR, Pluxee, Alelo, Ticket).
      </p>
    </Secao>
  </div>
</template>
