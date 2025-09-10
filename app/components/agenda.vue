<script setup lang="ts">
import agendaData from '~/assets/data/agenda.json'

const agendaDates = getAgendaDates()

const items = agendaData.map(item => ({
  title: item.title,
  description: item.description,
  icon: item.icon
}))
</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-center">
    <div class="flex flex-col gap-1 lg:col-span-2">
      <UText
        size="title"
        weight="bold"
        tag="h2"
        color="primary"
        class="italic"
      >
        Agenda <span class="dark:text-white text-black">Semanal</span>
      </UText>
      <UText
        tag="h2"
      >
        {{ agendaDates }}
      </UText>
      <UTimeline
        :default-value="3"
        :items="items"
        class="mt-8"
      />
    </div>
    <iframe
      loading="lazy"
      class="w-full lg:col-span-3 aspect-[4/5] rounded-xl md:rounded-4xl border-none pointer-events-none"
      src="https://www.canva.com/design/DAGx4N55Rhw/b1XLk_AwiiVTknbIuJxwOQ/view?embed"
      scrolling="no"
    />
  </div>
</template>
