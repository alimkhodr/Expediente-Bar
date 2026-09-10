/**
 * Ao abrir a página com #hash, mantém a seção alinhada ao topo enquanto o
 * layout acima dela ainda muda (hidratação, imagens, dados carregados).
 * Desliga assim que o usuário rola por conta própria ou após 4 s.
 */
export function useAncoraEstavel () {
  const route = useRoute()

  onMounted(() => {
    const hash = route.hash
    if (!hash || !('ResizeObserver' in window)) return

    const alinhar = () => {
      const alvo = document.querySelector(hash)
      alvo?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }

    const observador = new ResizeObserver(alinhar)
    observador.observe(document.body)

    const parar = () => {
      observador.disconnect()
      window.removeEventListener('wheel', parar)
      window.removeEventListener('touchstart', parar)
      window.removeEventListener('keydown', parar)
    }
    window.addEventListener('wheel', parar, { passive: true })
    window.addEventListener('touchstart', parar, { passive: true })
    window.addEventListener('keydown', parar)
    setTimeout(parar, 4000)
  })
}
