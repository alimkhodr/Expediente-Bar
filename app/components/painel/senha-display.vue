<script setup lang="ts">
import { estimateTextWidth, formatarSenha, nameForScreen } from '~/utils/fila'

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
// de .painel (Chrome antigo); no admin vem do tema.
const cor = computed(() => props.variante === 'atual' ? 'var(--ui-primary)' : 'var(--ui-text-muted)')
const corNumeroComNome = computed(() => props.variante === 'atual' ? 'var(--ui-text-highlighted)' : 'var(--ui-text-muted)')

const BASE_W = 300
const NAME_SIZE = 100
const NAME_MARGIN = 24

// Feedback do balcão: as pessoas procuram o NOME, então com nome ele vira o destaque
// e o número fica menor embaixo. Nomes longos encurtam (nameForScreen) e o viewBox
// alarga para caber o nome: com preserveAspectRatio="meet" tudo encolhe junto,
// então o nome nunca sai do card e continua sempre maior que o número.
// Geometria do SVG (margin/padding NÃO funcionam em <text>; tudo é y + viewBox).
// Sem nome mantém 300x200 com o número grande (layout original).
const nomeTela = computed(() => nameForScreen(props.nome))
const VIEW_W = computed(() => nomeTela.value
  ? Math.max(BASE_W, estimateTextWidth(nomeTela.value, NAME_SIZE) + NAME_MARGIN)
  : BASE_W)
const VIEW_H = computed(() => nomeTela.value ? 230 : 200)
const nomeY = 78
const numeroY = computed(() => nomeTela.value ? 182 : 100)
</script>

<template>
  <svg
    :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
    preserveAspectRatio="xMidYMid meet"
    class="senha-svg"
    :class="{ 'senha-glow': glow }"
    role="img"
    :aria-label="nomeTela ? `${nomeTela}, senha ${texto}` : `Senha ${texto}`"
  >
    <text
      v-if="nomeTela"
      :key="`nome-${nomeTela}-${trocou}`"
      x="50%"
      :y="nomeY"
      text-anchor="middle"
      dominant-baseline="central"
      class="senha-nome"
      :style="{
        animation: trocou ? 'senhaFlip 0.55s cubic-bezier(0.22,1,0.36,1)' : 'none',
        fill: cor
      }"
    >{{ nomeTela }}</text>
    <text
      :key="`${texto}-${trocou}`"
      x="50%"
      :y="numeroY"
      text-anchor="middle"
      dominant-baseline="central"
      class="senha-text"
      :class="{ 'senha-text--com-nome': nomeTela }"
      :style="{
        animation: trocou && !nomeTela ? 'senhaFlip 0.55s cubic-bezier(0.22,1,0.36,1)' : 'none',
        fill: nomeTela ? corNumeroComNome : cor
      }"
    >{{ texto }}</text>
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
.senha-text--com-nome {
  font-size: 72px;
  letter-spacing: -3px;
}
.senha-nome {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 100px;
  letter-spacing: -1px;
  transform-box: fill-box;
  transform-origin: center;
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
