export interface Senha {
  id: number
  numero: number
  criado_em: string
}

export function useSenhas (limite = 10) {
  const supabase = useSupabaseClient()

  const senhas = ref<Senha[]>([])
  const carregando = ref(true)
  const trocou = ref(0) // incrementa quando a senha atual muda (gatilho de animação/alerta)

  const atual = computed<Senha | null>(() => senhas.value[0] ?? null)
  const historico = computed<Senha[]>(() => senhas.value.slice(1))

  async function carregar () {
    // @ts-expect-error - Supabase schema may not be defined
    const { data } = await supabase
      .from('senhas')
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(limite)

    if (data) {
      const anterior = atual.value?.id
      senhas.value = data as Senha[]
      if (anterior && atual.value && atual.value.id !== anterior) {
        trocou.value++
      }
    }
    carregando.value = false
  }

  let channel: ReturnType<typeof supabase.channel> | null = null

  onMounted(() => {
    carregar()
    channel = supabase
      .channel('senhas-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'senhas' }, () => carregar())
      .subscribe()
  })

  onUnmounted(() => {
    if (channel) supabase.removeChannel(channel)
  })

  return { senhas, atual, historico, carregando, trocou, recarregar: carregar }
}
