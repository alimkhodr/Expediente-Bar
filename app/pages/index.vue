<script setup lang="ts">
const title = 'Expediente Bar'
const headDescription = 'O melhor expediente é aqui! Descubra nossos horários, localização, eventos e tire suas dúvidas sobre nosso bar.'

useSeoMeta({
  title,
  description: headDescription,
  ogTitle: title,
  ogDescription: headDescription,
  twitterTitle: title,
  twitterDescription: headDescription,
  robots: 'index,follow'
})
</script>
<template>
  <div>
    <ScreenCarousel/>

    <Container
      id="agenda"
      contrast
    >
      <Agenda />
    </Container>
    <Container id="galeria">
      <Gallery />
    </Container>
    <Container
      id="mapa"
      contrast
    >
      <Map />
    </Container>
    <Container id="avaliacoes">
      <Reviews />
    </Container>
    <Container
      id="faq"
      contrast
    >
      <Faq />
    </Container>
    <BrandsCarousel/>
    <Container
      id="local"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <Address class="h-full" />
        <OpeningHours/>
      </div>
    </Container>
    <Footer class="dark:bg-stone-950 light:bg-stone-100"/>
  </div>

</template>
