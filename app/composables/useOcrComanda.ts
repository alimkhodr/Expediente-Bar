import { createWorker, type Worker } from 'tesseract.js'

export function useOcrComanda () {
  let worker: Worker | null = null

  async function reconhecer (image: string | Blob): Promise<string> {
    if (!worker) worker = await createWorker('por')
    const { data } = await worker.recognize(image)
    return data.text
  }

  // Libera o worker do Tesseract. Chamado ao fechar o modal para que a memória
  // do WASM não acumule entre sessões de escaneamento (o worker é recriado
  // sob demanda na próxima leitura).
  async function terminar () {
    if (worker) {
      const w = worker
      worker = null
      await w.terminate()
    }
  }

  onUnmounted(terminar)

  return { reconhecer, terminar }
}
