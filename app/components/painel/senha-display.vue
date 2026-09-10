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
// var(--ui-*): no /tv o PainelPublico redefine essas variaveis em hex dentro
// de .painel (Chrome antigo); no /acompanhar (Nuxt UI) vem do tema.
const cor = computed(() => props.variante === 'atual' ? 'var(--ui-primary)' : 'var(--ui-text-muted)')

const VIEW_W = 300
// Geometria do SVG (margin/padding NÃO funcionam em <text>; tudo é y + viewBox).
// Com nome, o viewBox cresce para abrir espaço para o nome abaixo do número.
// Sem nome, mantém 300x200 (layout idêntico ao original).
//   numeroY = centro do número | nomeY = centro do nome | VIEW_H = altura total
const VIEW_H = computed(() => props.nome ? 248 : 200)
const numeroY = computed(() => props.nome ? 96 : 100)
const nomeY = 226
</script>

<template>
  <svg
    :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
    preserveAspectRatio="xMidYMid meet"
    class="senha-svg"
    :class="{ 'senha-glow': glow }"
  >
    <text
      :key="`${texto}-${trocou}`"
      x="50%"
      :y="numeroY"
      text-anchor="middle"
      dominant-baseline="central"
      class="senha-text"
      :style="{
        animation: trocou ? 'senhaFlip 0.55s cubic-bezier(0.22,1,0.36,1)' : 'none',
        fill: cor
      }"
    >{{ texto }}</text>
    <text
      v-if="nome"
      x="50%"
      :y="nomeY"
      text-anchor="middle"
      dominant-baseline="central"
      class="senha-nome"
      :style="{ fill: cor }"
    >{{ nome }}</text>
  </svg>
</template>

<style scoped>
/* Fire TV, Chrome antigo (< 111): sem Tailwind no sizing, cores em hex/rgba.
   O tamanho da caixa vem de quem usa (classe passada na raiz): no /tv o pai
   da width/height 100% e preserveAspectRatio="meet" faz numero + nome
   caberem inteiros e centralizados, sem cortar. */
.senha-svg {
  display: block;
  max-width: 100%;
}
.senha-text {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 170px;
  letter-spacing: -8px;
  transform-box: fill-box;
  transform-origin: center;
}
.senha-nome {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
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
