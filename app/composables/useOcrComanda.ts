import { createWorker, type Worker } from 'tesseract.js'

export function useOcrComanda () {
  const lendo = ref(false)
  let worker: Worker | null = null

  async function reconhecer (image: string | Blob): Promise<string> {
    lendo.value = true
    try {
      if (!worker) worker = await createWorker('por')
      const { data } = await worker.recognize(image)
      return data.text
    } finally {
      lendo.value = false
    }
  }

  onUnmounted(async () => {
    if (worker) {
      await worker.terminate()
      worker = null
    }
  })

  return { lendo, reconhecer }
}
