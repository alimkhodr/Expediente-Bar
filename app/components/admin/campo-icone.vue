<script setup lang="ts">
import { ICONES_CMS, type IconeCms } from '~/types/conteudo'

const modelo = defineModel<IconeCms>({ required: true })

const opcoes = ICONES_CMS.map(icone => ({
  label: icone.replace(/^i-(lucide|simple-icons)-/, '').replace(/-/g, ' '),
  value: icone,
  icon: icone
}))
</script>

<template>
  <USelectMenu
    v-model="modelo"
    :items="opcoes"
    value-key="value"
    :icon="modelo"
    :search-input="{ placeholder: 'Buscar ícone…' }"
    class="w-full"
  />
</template>
