import { faltam as calcFaltam, ehSuaVez as calcEhSuaVez, validarSenha } from '~/utils/fila'
import type { Senha } from '~/composables/useSenhas'

const STORAGE_KEY = 'painel:minha-senha'

export function useAcompanhamento (atual: Ref<Senha | null>) {
  const { permitido, pedirPermissao, avisar } = useAlertas()

  const minhaSenha = ref<number | null>(null)
  const erro = ref<string | null>(null)
  let jaAvisou = false

  onMounted(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) minhaSenha.value = parseInt(salvo, 10)
  })

  const acompanhando = computed(() => minhaSenha.value != null)
  const faltam = computed(() =>
    atual.value && minhaSenha.value != null ? calcFaltam(atual.value.numero, minhaSenha.value) : null
  )
  const ehSuaVez = computed(() =>
    !!(atual.value && minhaSenha.value != null && calcEhSuaVez(atual.value.numero, minhaSenha.value))
  )

  async function acompanhar (senha: number) {
    const base = atual.value?.numero ?? 1
    const v = validarSenha(base, senha)
    if (!v.ok) {
      erro.value = v.mensagem ?? 'Senha inválida.'
      return false
    }
    erro.value = null
    minhaSenha.value = senha
    jaAvisou = false
    localStorage.setItem(STORAGE_KEY, String(senha))
    await pedirPermissao()
    return true
  }

  function limpar () {
    minhaSenha.value = null
    erro.value = null
    jaAvisou = false
    localStorage.removeItem(STORAGE_KEY)
  }

  watch(ehSuaVez, (agora) => {
    if (agora && !jaAvisou) {
      jaAvisou = true
      avisar('É a sua vez!', `Senha ${minhaSenha.value} — retire seu pedido no balcão.`)
    }
  })

  return { minhaSenha, erro, acompanhando, faltam, ehSuaVez, acompanhar, limpar, permitido }
}
