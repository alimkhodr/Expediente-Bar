<script setup lang="ts">
import type { PerguntaFaq } from '~/types/conteudo'

const props = defineProps<{ perguntas: PerguntaFaq[] }>()
const { trackEvent } = useAnalytics()

function aoAbrir (valor: string | string[] | undefined) {
  const abertos = Array.isArray(valor) ? valor : valor ? [valor] : []
  const ultimo = abertos[abertos.length - 1]
  if (ultimo !== undefined) trackEvent('faq_abrir', { pergunta: props.perguntas[Number(ultimo)]?.question })
}

const itens = computed(() => props.perguntas.map(p => ({
  label: p.question,
  content: p.answer,
  icon: 'i-lucide-circle-help'
})))
</script>

<template>
  <Secao
    id="faq"
    destaque="Perguntas"
    titulo="frequentes"
    descricao="Ficou alguma dúvida? Chama a gente no WhatsApp."
    contraste
  >
    <template #acoes>
      <UButton
        :to="links.whatsapp(whatsappMessages.contato)"
        target="_blank"
        rel="noopener noreferrer"
        color="neutral"
        variant="outline"
        icon="i-simple-icons-whatsapp"
        class="self-start"
        @click="trackEvent('contato_whatsapp_click', { source: 'faq' })"
      >
        Falar no WhatsApp
      </UButton>
    </template>
    <UAccordion
      :items="itens"
      type="multiple"
      :ui="{
        item: 'border-white/10',
        trigger: 'py-4 text-base font-medium text-white',
        body: 'pb-4 text-muted leading-relaxed'
      }"
      @update:model-value="aoAbrir"
    />
  </Secao>
</template>
