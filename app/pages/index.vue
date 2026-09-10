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
  schemaFaq(faq.value)
])
</script>

<template>
  <div>
    <HeroLinks :itens="linksHero" />
    <LazyMarcas hydrate-on-visible />
    <LazyDestaques
      hydrate-on-visible
      :destaques="destaques"
    />
    <LazyEventosPreview hydrate-on-visible />
    <LazyAgendaSemanal
      hydrate-on-visible
      :agenda="agenda"
    />
    <LazyGaleria hydrate-on-visible />
    <LazyReservas hydrate-on-visible />
    <LazyAvaliacoes hydrate-on-visible />
    <LazyPerguntasFrequentes
      hydrate-on-visible
      :perguntas="faq"
    />
    <LazyLocal hydrate-on-visible />
  </div>
</template>
