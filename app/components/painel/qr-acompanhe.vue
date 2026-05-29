<script setup lang="ts">
import QRCode from 'qrcode.vue'

const url = computed(() => {
  if (import.meta.client) return `${window.location.origin}/painel/acompanhar`
  return ''
})
</script>

<template>
  <UCard :ui="{body:'p-3 sm:p-3'}">
    <div class="flex items-center gap-4">
      <span class="text-muted text-right leading-tight text-[clamp(0.9rem,1.6cqi,1rem)] max-w-[10ch] ">
        Acompanhe pelo celular
      </span>
      <div
        class="bg-white p-1 rounded border border-muted"
      >
        <QRCode
          :value="url"
          :size="50"
          level="H"
        />
      </div>
    </div>
  </UCard>
</template>
