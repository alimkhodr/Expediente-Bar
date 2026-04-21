<script setup lang="ts">
import type { AvisoAction, Aviso } from '~/types/aviso'

const toast = useToast()
const { trackEvent } = useAnalytics()
const supabase = useSupabaseClient()

onMounted(() => {
  fetchAvisos().then(showToasts)
})

async function fetchAvisos (): Promise<Aviso[]> {
  const { data } = await supabase.from('avisos').select('*')
  return (data ?? []) as Aviso[]
}

function handleAvisoClick (action: AvisoAction, aviso: Aviso) {
  trackEvent('aviso_action_click', {
    aviso_title: aviso.title,
    aviso_description: aviso.description,
    action_label: action.label,
    action_link: action.link
  })
  if (action.link) {
    window.open(action.link, '_blank')
  }
}

function showToasts (avisos: Aviso[]) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

  const avisosHoje = avisos.filter(aviso =>
    aviso.status && (aviso.days?.includes('all') || aviso.days?.includes(today))
  )

  avisosHoje.forEach((aviso, index) => {
    setTimeout(() => {
      toast.add({
        title: aviso.title,
        description: aviso.description,
        avatar: aviso.avatar,
        actions: aviso.actions?.map((a: AvisoAction) => ({
          label: a.label,
          trailingIcon: a.trailingIcon,
          color: 'primary' as const,
          variant: 'solid' as const,
          onClick: () => handleAvisoClick(a, aviso)
        }))
      })
    }, index * 1000)
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
