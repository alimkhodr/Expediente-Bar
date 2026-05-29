<script setup lang="ts">
import { formatarSenha } from '~/utils/fila'

const props = withDefaults(defineProps<{
  numero: number | null | undefined
  variante?: 'atual' | 'historico'
  glow?: boolean
  trocou?: number
}>(), {
  variante: 'atual',
  glow: false,
  trocou: 0
})

const texto = computed(() => formatarSenha(props.numero))

const VIEW_W = 300
const VIEW_H = 200
</script>

<template>
  <svg
    :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
    preserveAspectRatio="xMidYMid meet"
    class="block max-w-full"
    :class="glow ? 'senha-glow' : ''"
  >
    <text
      :key="`${texto}-${trocou}`"
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="central"
      class="font-bold senha-text"
      :style="{
        animation: trocou ? 'senhaFlip 0.55s cubic-bezier(0.22,1,0.36,1)' : 'none',
        fill: variante === 'atual' ? 'var(--ui-primary)' : 'var(--ui-text-muted)'
      }"
    >{{ texto }}</text>
  </svg>
</template>

<style scoped>
.senha-text {
  font-family: 'Poppins', sans-serif;
  font-size: 170px;
  letter-spacing: -8px;
  transform-box: fill-box;
  transform-origin: center;
}
.senha-glow {
  filter: drop-shadow(0 0 28px color-mix(in srgb, var(--color-yellow-500) 45%, transparent));
}
@keyframes senhaFlip {
  0%   { transform: translateY(18%) scaleY(0.7); opacity: 0; }
  60%  { transform: translateY(-4%) scaleY(1.04); opacity: 1; }
  80%  { transform: translateY(2%) scaleY(0.98); }
  100% { transform: translateY(0) scaleY(1); opacity: 1; }
}
</style>
