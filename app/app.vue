<script setup lang="ts">
import { avisos } from '~/assets/data/avisos'
import type { AvisoAction } from '~/types/aviso'
import type { ButtonProps } from '#ui/types'

const toast = useToast()
const { trackEvent } = useClarity()

onMounted(() => {
  showToasts()
})

function handleAvisoClick (action: AvisoAction) {
  trackEvent(`click_${action.label}`)
  if (action.link) {
    window.open(action.link, '_blank')
  }
}

function showToasts () {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

  const avisosHoje = avisos.filter(aviso =>
    aviso.status && (aviso.days?.includes('all') || aviso.days?.includes(today))
  )

  avisosHoje.forEach((aviso, index) => {
    setTimeout(() => {
      toast.add({
        ...aviso,
        actions: aviso.actions?.map((a: AvisoAction) => ({
          ...a,
          color: a.color as ButtonProps['color'],
          variant: a.variant as ButtonProps['variant'],
          onClick: () => handleAvisoClick(a)
        }))
      })
    }, index * 500)
  })
}
</script>

<template>
  <UApp>
    <NuxtLayout class="layouts">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
