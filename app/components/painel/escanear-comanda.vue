<script setup lang="ts">
import { parseComanda } from '~/utils/comanda'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirm: [{ nome: string | null, numero: number }] }>()

const { reconhecer, terminar } = useOcrComanda()

type Etapa = 'camera' | 'confirmar'
const etapa = ref<Etapa>('camera')
const erroCamera = ref('')
const videoEl = ref<HTMLVideoElement | null>(null)
let stream: MediaStream | null = null

const nome = ref('')
const numero = ref('')

// Quantas leituras seguidas sem resultado limpo antes de cair na tela manual.
const MAX_TENTATIVAS = 12
let rodando = false // loop de auto-scan ativo

async function iniciarCamera () {
  erroCamera.value = ''
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    if (videoEl.value) {
      videoEl.value.srcObject = stream
      await videoEl.value.play()
    }
    autoEscanear()
  } catch {
    erroCamera.value = 'Não foi possível acessar a câmera. Verifique a permissão do navegador.'
  }
}

function pararCamera () {
  rodando = false
  stream?.getTracks().forEach(t => t.stop())
  stream = null
}

const MAX_LARGURA = 1600

// Captura um frame e roda o OCR. Devolve null se a câmera ainda não está pronta
// (não conta como tentativa); caso contrário, o que o parser conseguiu extrair.
async function lerFrame () {
  const video = videoEl.value
  if (!video || !video.videoWidth) return null
  // Reduz a imagem para no máx MAX_LARGURA de largura: menos memória por leitura
  // (evita o acúmulo que trava o worker) e melhor precisão do OCR.
  const escala = Math.min(1, MAX_LARGURA / video.videoWidth)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(video.videoWidth * escala)
  canvas.height = Math.round(video.videoHeight * escala)
  canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
  const dataUrl = canvas.toDataURL('image/png')

  const texto = await reconhecer(dataUrl)
  return parseComanda(texto)
}

// Loop de leitura: tenta ler sozinho até vir uma comanda limpa (nome + número
// válido) e aí lança direto — sem nenhum toque. Se não conseguir após
// MAX_TENTATIVAS, cai na tela de confirmar com o melhor palpite pra ajuste manual.
async function autoEscanear () {
  if (rodando) return
  rodando = true
  let tentativas = 0

  while (rodando && etapa.value === 'camera' && open.value) {
    const r = await lerFrame()
    if (!rodando) return

    // Câmera ainda inicializando: espera sem gastar tentativa.
    if (!r) {
      await new Promise(res => setTimeout(res, 200))
      continue
    }

    if (r.nome && r.numero != null && r.numero >= 1 && r.numero <= 999) {
      nome.value = r.nome
      numero.value = String(r.numero)
      pararCamera()
      lancar()
      return
    }

    tentativas++
    if (tentativas >= MAX_TENTATIVAS) {
      nome.value = r.nome ?? ''
      numero.value = r.numero != null ? String(r.numero) : ''
      pararCamera()
      etapa.value = 'confirmar'
      return
    }

    // Respiro entre leituras: dá tempo da câmera estabilizar e libera a UI.
    await new Promise(res => setTimeout(res, 400))
  }
}

function voltar () {
  etapa.value = 'camera'
  nextTick(iniciarCamera)
}

function lancar () {
  const n = parseInt(numero.value, 10)
  if (!n || n < 1 || n > 999) return
  emit('confirm', { nome: nome.value.trim() || null, numero: n })
  open.value = false
}

watch(open, (v) => {
  if (v) {
    etapa.value = 'camera'
    nome.value = ''
    numero.value = ''
    nextTick(iniciarCamera)
  } else {
    pararCamera()
    // Libera o worker do Tesseract ao fechar: cada sessão começa limpa e a
    // memória do WASM não acumula a ponto de travar o escaneamento.
    terminar()
  }
})

onUnmounted(() => {
  pararCamera()
  terminar()
})
</script>

<template>
  <UModal
    v-model:open="open"
    fullscreen
    title="Escanear comanda"
    :ui="{ body: 'flex flex-col' }"
  >
    <template #body>
      <div
        v-if="etapa === 'camera'"
        class="flex-1 flex flex-col items-center justify-center gap-4"
      >
        <div
          v-if="erroCamera"
          class="text-error text-center"
        >
          {{ erroCamera }}
        </div>
        <video
          ref="videoEl"
          playsinline
          muted
          class="max-h-[60vh] w-auto rounded-lg bg-black"
        />
        <div class="flex items-center gap-2 text-muted">
          <UIcon
            name="i-heroicons-arrow-path"
            class="size-5 animate-spin"
          />
          <span>Lendo comanda...</span>
        </div>
      </div>

      <div
        v-else
        class="flex-1 flex flex-col items-center justify-center gap-6 max-w-md mx-auto w-full"
      >
        <h3 class="text-lg font-semibold">
          Confirmar lançamento
        </h3>
        <UFormField
          label="Nome (opcional)"
          class="w-full"
        >
          <UInput
            v-model="nome"
            size="xl"
            placeholder="Jihad"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Número"
          required
          class="w-full"
        >
          <UInput
            v-model="numero"
            type="number"
            size="xl"
            placeholder="455"
            class="w-full"
          />
        </UFormField>
        <div class="flex gap-3 w-full">
          <UButton
            color="neutral"
            variant="subtle"
            block
            label="Escanear de novo"
            @click="voltar"
          />
          <UButton
            block
            size="xl"
            icon="fluent:megaphone-loud-48-filled"
            label="Lançar"
            @click="lancar"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
