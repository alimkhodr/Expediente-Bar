<script setup lang="ts">
const paginas = [
  { src: '/images/cardapio/1.webp', largura: 1414, altura: 2000, titulo: 'Cardápio – porções e petiscos' },
  { src: '/images/cardapio/2.webp', largura: 1414, altura: 2000, titulo: 'Cardápio – lanches e pratos' },
  { src: '/images/cardapio/3.webp', largura: 1414, altura: 2000, titulo: 'Cardápio – cervejas e bebidas' },
  { src: '/images/cardapio/4.webp', largura: 1414, altura: 2000, titulo: 'Cardápio – drinks e doses' }
]

const descricao = 'Cardápio completo do Expediente Bar em São José dos Campos: porções, petiscos, lanches, cervejas, drinks e doses. Veja com zoom direto no celular.'

usePaginaSeo({
  titulo: 'Cardápio',
  descricao,
  caminho: '/cardapio'
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
    hasMenuSection: paginas.map(p => ({ '@type': 'MenuSection', name: p.titulo.replace('Cardápio – ', '') }))
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

      <p class="mt-10 text-center text-xs text-muted">
        Preços e itens podem mudar sem aviso. Aceitamos cartões, Pix e vales-refeição (VR, Pluxee, Alelo, Ticket).
      </p>
    </Secao>
  </div>
</template>
