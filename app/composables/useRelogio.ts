export function useRelogio () {
  const agora = ref(new Date())
  let timer: ReturnType<typeof setInterval> | null = null

  const hora = computed(() =>
    new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(agora.value)
  )
  const data = computed(() => {
    const fmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
    const s = fmt.format(agora.value)
    return s.charAt(0).toUpperCase() + s.slice(1)
  })

  onMounted(() => {
    timer = setInterval(() => { agora.value = new Date() }, 1000 * 30)
  })
  onUnmounted(() => { if (timer) clearInterval(timer) })

  return { hora, data }
}
