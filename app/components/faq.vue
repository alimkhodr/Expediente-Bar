<script setup lang="ts">
import faqData from '~/assets/data/faq.json'
import type { FAQItem } from '~/types'

const faqItems: FAQItem[] = faqData

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqItems.map(item => ({
    '@type': 'Question',
    'name': item.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': item.answer
    }
  }))
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqStructuredData)
    }
  ]
})
</script>

<template>
  <div class="flex flex-col w-full gap-2">
    <div class="">
      <UText
        size="title"
        weight="bold"
        tag="h2"
        color="primary"
        class="italic mb-2 md:text-center"
      >
        Perguntas Frequentes
      </UText>
      <UText
        tag="h2"
        class="md:text-center"
      >
        Entre em contato caso necessário
      </UText>
    </div>
    <UAccordion
      :items="faqItems.map((item, index) => ({
        label: item.question,
        slot: `item-${index}`,
        defaultOpen: false
      }))"
      multiple
      class="space-y-2"
    >
      <template
        v-for="(item, index) in faqItems"
        :key="index"
        #[`item-${index}`]
      >
        <div class="p-4">
          <UText class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ item.answer }}
          </UText>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
