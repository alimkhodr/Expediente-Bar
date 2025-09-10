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

    <section
      id="mapa"
      class="dark:bg-stone-950 light:bg-stone-100"
    >
      <UContainer id="agenda">
        <Agenda />
      </UContainer>
    </section>
    <UContainer id="galeria">
      <Gallery />
    </UContainer>
    <section
      id="mapa"
      class="dark:bg-stone-950 light:bg-stone-100"
    >
      <UContainer>
        <Map />
      </UContainer>
    </section>
    <UContainer id="avaliacoes">
      <Reviews />
    </UContainer>
    <section
      id="faq"
      class="dark:bg-stone-950 light:bg-stone-100"
    >
      <UContainer>
        <Faq />
      </UContainer>
    </section>
    <BrandsCarousel/>
    <UContainer
      id="local"
      class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
    >
      <Address class="h-full" />
      <OpeningHours/>
    </UContainer>
    <Footer class="dark:bg-stone-950 light:bg-stone-100"/>
  </div>

</template>
