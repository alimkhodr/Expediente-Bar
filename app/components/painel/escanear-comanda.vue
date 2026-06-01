<script setup lang="ts">
import { parseComanda } from '~/utils/comanda'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirm: [{ nome: string | null, numero: number }] }>()

const { lendo, reconhecer } = useOcrComanda()

type Etapa = 'camera' | 'confirmar'
const etapa = ref<Etapa>('camera')
const erroCamera = ref('')
const videoEl = ref<HTMLVideoElement | null>(null)
let stream: MediaStream | null = null

const nome = ref('')
const numero = ref('')

async function iniciarCamera () {
  erroCamera.value = ''
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    if (videoEl.value) {
      videoEl.value.srcObject = stream
      await videoEl.value.play()
    }
  } catch {
    erroCamera.value = 'Não foi possível acessar a câmera. Verifique a permissão do navegador.'
  }
}

function pararCamera () {
  stream?.getTracks().forEach(t => t.stop())
  stream = null
}

async function escanear () {
  const video = videoEl.value
  if (!video || !video.videoWidth) return
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d')?.drawImage(video, 0, 0)
  const dataUrl = canvas.toDataURL('image/png')

  const texto = await reconhecer(dataUrl)
  const r = parseComanda(texto)
  nome.value = r.nome ?? ''
  numero.value = r.numero != null ? String(r.numero) : ''
  pararCamera()
  etapa.value = 'confirmar'
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
  }
})

onUnmounted(pararCamera)
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
        <UButton
          size="xl"
          icon="i-heroicons-camera"
          :loading="lendo"
          :label="lendo ? 'Lendo...' : 'Escanear'"
          @click="escanear"
        />
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
