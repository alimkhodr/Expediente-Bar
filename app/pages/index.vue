<script setup lang="ts">
const { links: linksHero, destaques, agenda, faq } = useConteudo()

usePaginaSeo({
  titulo: 'Expediente Bar · Pagode ao vivo, cerveja gelada e porções em São José dos Campos',
  descricao: site.description,
  caminho: '/',
  tituloCompleto: true
})

useSchemaOrg([
  schemaNegocio(),
  schemaWebSite(),
  schemaPagina('/', 'Expediente Bar', site.description),
  schemaFaq(faq.value),
  schemaGaleria()
])
</script>

<template>
  <div>
    <HeroLinks :itens="linksHero" />
    <LazyMarcas hydrate-on-visible />
    <!-- Cores alternadas (cinza/preto) calculadas pela posição das seções visíveis:
         eventos e avaliações somem sem dados, então nada de cor fixa por seção (ver main.css) -->
    <div class="section-group section-group--before-gallery">
      <LazyDestaques
        hydrate-on-visible
        :destaques="destaques"
      />
      <LazyEventosPreview hydrate-on-visible />
      <LazyAgendaSemanal
        hydrate-on-visible
        :agenda="agenda"
      />
    </div>
    <LazyPhotoWall hydrate-on-visible />
    <div class="section-group section-group--after-gallery">
      <LazyReservas hydrate-on-visible />
      <LazyAvaliacoes hydrate-on-visible />
      <LazyPerguntasFrequentes
        hydrate-on-visible
        :perguntas="faq"
      />
      <LazyLocal hydrate-on-visible />
    </div>
  </div>
</template>
