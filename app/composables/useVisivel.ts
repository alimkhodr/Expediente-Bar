import type { Ref } from 'vue'

/** Vira true (uma vez) quando o elemento entra na viewport. Sem IntersectionObserver, vira true na montagem. */
export function useVisivel (alvo: Ref<HTMLElement | null>, margem = '200px') {
  const visivel = ref(false)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    if (!alvo.value) return
    if (!('IntersectionObserver' in window)) {
      visivel.value = true
      return
    }
    observer = new IntersectionObserver((entradas) => {
      if (entradas.some(e => e.isIntersecting)) {
        visivel.value = true
        observer?.disconnect()
      }
    }, { rootMargin: margem })
    observer.observe(alvo.value)
  })

  onUnmounted(() => observer?.disconnect())

  return visivel
}
