export function useAlertas () {
  const permitido = ref(false)

  function suportaNotificacao () {
    return import.meta.client && 'Notification' in window
  }

  async function pedirPermissao (): Promise<boolean> {
    if (!suportaNotificacao()) return false
    const r = await Notification.requestPermission()
    permitido.value = r === 'granted'
    return permitido.value
  }

  function tocarSom () {
    if (!import.meta.client) return
    try {
      const Ctx = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(); osc.stop(ctx.currentTime + 0.5)
      osc.onended = () => ctx.close()
    } catch { /* áudio bloqueado */ }
  }

  function vibrar () {
    if (import.meta.client && 'vibrate' in navigator) navigator.vibrate([200, 100, 200])
  }

  function avisar (titulo: string, corpo: string) {
    tocarSom()
    vibrar()
    if (permitido.value && suportaNotificacao()) {
      try { new Notification(titulo, { body: corpo, icon: '/icon.svg' }) } catch { /* noop */ }
    }
  }

  return { permitido, pedirPermissao, avisar }
}
