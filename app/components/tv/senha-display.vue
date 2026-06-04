<script setup lang="ts">
import { formatarSenha } from '~/utils/fila'

const props = withDefaults(defineProps<{
  numero: number | null | undefined
  nome?: string | null
  variante?: 'atual' | 'historico'
  glow?: boolean
  trocou?: number
}>(), {
  nome: null,
  variante: 'atual',
  glow: false,
  trocou: 0
})

const texto = computed(() => formatarSenha(props.numero))
const cor = computed(() => props.variante === 'atual' ? 'var(--ui-primary)' : 'var(--ui-text-muted)')

const VIEW_W = 300
// Com nome, o viewBox cresce para abrir espaço para o nome abaixo do número.
// Sem nome, mantém 300x200 (layout idêntico ao original).
const VIEW_H = computed(() => props.nome ? 248 : 200)
const numeroY = computed(() => props.nome ? 96 : 100)
</script>

<template>
  <svg
    :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
    preserveAspectRatio="xMidYMid meet"
    class="senha-svg"
    :class="glow ? 'senha-glow' : ''"
  >
    <text
      :key="`${texto}-${trocou}`"
      x="50%"
      :y="numeroY"
      text-anchor="middle"
      dominant-baseline="central"
      class="font-bold senha-text"
      :style="{
        animation: trocou ? 'senhaFlip 0.55s cubic-bezier(0.22,1,0.36,1)' : 'none',
        fill: cor
      }"
    >{{ texto }}</text>
    <text
      v-if="nome"
      x="50%"
      y="226"
      text-anchor="middle"
      dominant-baseline="central"
      class="font-semibold senha-nome"
      :style="{ fill: cor }"
    >{{ nome }}</text>
  </svg>
</template>

<style scoped>
/* preenche a caixa do card (largura E altura); preserveAspectRatio="meet"
   faz o numero + nome caberem inteiros e centralizados, sem cortar.
   Define o sizing aqui (e nao via classes Tailwind) p/ funcionar no Chrome antigo. */
.senha-svg {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
}
.senha-text {
  font-family: 'Poppins', sans-serif;
  font-size: 170px;
  letter-spacing: -8px;
  transform-box: fill-box;
  transform-origin: center;
}
.senha-nome {
  font-family: 'Poppins', sans-serif;
  font-size: 40px;
  letter-spacing: -1px;
}
.senha-glow {
  /* rgba estatico no lugar de color-mix() (Chrome <111 nao suporta) */
  filter: drop-shadow(0 0 28px rgba(255, 165, 7, 0.45));
}
@keyframes senhaFlip {
  0%   { transform: translateY(18%) scaleY(0.7); opacity: 0; }
  60%  { transform: translateY(-4%) scaleY(1.04); opacity: 1; }
  80%  { transform: translateY(2%) scaleY(0.98); }
  100% { transform: translateY(0) scaleY(1); opacity: 1; }
}
</style>
