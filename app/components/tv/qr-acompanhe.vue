<script setup lang="ts">
import QRCode from 'qrcode.vue'

const url = computed(() => {
  if (import.meta.client) return `${window.location.origin}/painel/acompanhar`
  return ''
})
</script>

<template>
  <div class="card qr">
    <span class="qr-label">Acompanhe pelo celular</span>
    <div class="qr-box">
      <QRCode
        :value="url"
        :size="60"
        level="H"
      />
    </div>
  </div>
</template>

<style scoped>
.qr {
  display: flex;
  align-items: center;
  gap: 1.5vmin;
  padding: 1.2vmin 1.5vmin;
}
.qr-label {
  max-width: 10ch;
  text-align: right;
  line-height: 1.15;
  font-size: 3vmin;
  color: #a1a1aa;
}
.qr-box {
  display: flex;
  padding: 0.5vmin;
  background: #fff;
  border: 1px solid #27272a;
  border-radius: 0.6vmin;
}

/* no mobile (portrait) o vmin encolhe -> raio maior pra acompanhar o tamanho */
@media (orientation: portrait) {
  .qr-box {
    border-radius: 1.4vmin;
  }
}
</style>
