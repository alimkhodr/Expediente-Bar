<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-center">
    <div class="flex flex-col gap-4 lg:col-span-2">
      <UText
        size="title"
        weight="bold"
        tag="h2"
        color="primary"
        class="italic"
      >
        Mapa <span class="dark:text-white text-black">da casa</span>
      </UText>
      <UAlert
        title="Reserve sua mesa!"
        description="Use o mapa de referência para reservar!"
        color="neutral"
        variant="outline"
        orientation="horizontal"
        :actions="[
          {
            label: 'Reservar',
            to: links.whatsapp('Olá! Gostaria de fazer uma reserva.'),
            target: '_blank'
          },
        ]"
        icon="tabler-brand-whatsapp-filled"
        :ui="{
          icon: 'size-11 text-primary',
        }"
        class="dark:bg-stone-950 light:bg-stone-100"
      />
    </div>
    <NuxtImg
      format="webp"
      src="/images/mapa.svg"
      alt="Mapa"
      class="w-full lg:col-span-3"
    />
  </div>
</template>
