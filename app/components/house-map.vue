<script setup lang="ts">
/**
 * Mapa ilustrativo da casa (SVG inline), fiel à planta original:
 * frente com Salão 1, Salão 2 (palco) e Anexo (telão); atrás Deck, Área coberta
 * e a Área descoberta em L, com a portaria na lateral.
 */
const BRAND = '#FFA507'
const INK = '#000'
const LABEL_LIGHT = '#F5F0E6'
</script>

<template>
  <svg
    viewBox="0 0 680 614"
    role="img"
    aria-labelledby="house-map-title house-map-desc"
    class="house-map h-auto w-full"
  >
    <title id="house-map-title">Mapa da casa do Expediente Bar</title>
    <desc id="house-map-desc">
      Na frente: Salão 1, Salão 2 com o palco e Anexo com o telão. Atrás: deck, área coberta
      e área descoberta em L, com a portaria na lateral, ao lado do deck.
    </desc>

    <!-- Contorno externo em L (uma única forma, com borda clara para destacar no fundo escuro) -->
    <path
      d="M52 40H628Q640 40 640 52V562Q640 574 628 574H221Q209 574 209 562V489H52Q40 489 40 477V52Q40 40 52 40Z"
      :fill="INK"
      stroke="rgba(255,255,255,0.22)"
      stroke-width="2"
    />

    <!-- Ambientes -->
    <rect
      x="45"
      y="45"
      width="190"
      height="246"
      rx="8"
      :fill="BRAND"
    />
    <rect
      x="245"
      y="45"
      width="185"
      height="246"
      rx="8"
      :fill="BRAND"
    />
    <rect
      x="440"
      y="45"
      width="195"
      height="246"
      rx="8"
      :fill="BRAND"
    />
    <rect
      x="45"
      y="301"
      width="190"
      height="183"
      rx="8"
      :fill="BRAND"
    />
    <rect
      x="245"
      y="301"
      width="185"
      height="183"
      rx="8"
      :fill="BRAND"
    />
    <!-- Portaria (faixa lateral da área descoberta) -->
    <rect
      x="214"
      y="494"
      width="26"
      height="75"
      rx="6"
      :fill="BRAND"
    />
    <!-- Área descoberta em L -->
    <path
      d="M444 305H631V565H254V498H444Z"
      :fill="BRAND"
      :stroke="BRAND"
      stroke-width="8"
      stroke-linejoin="round"
    />

    <!-- Palco e telão -->
    <rect
      x="264"
      y="62"
      width="116"
      height="105"
      rx="10"
      :fill="INK"
    />
    <text
      x="322"
      y="120"
      text-anchor="middle"
      class="house-map__label house-map__label--feature"
      :fill="LABEL_LIGHT"
    >Palco</text>
    <rect
      x="457"
      y="62"
      width="123"
      height="58"
      rx="10"
      :fill="INK"
    />
    <text
      x="518"
      y="96"
      text-anchor="middle"
      class="house-map__label house-map__label--small"
      :fill="LABEL_LIGHT"
    >Telão</text>

    <!-- Rótulos dos ambientes -->
    <text
      x="54"
      y="282"
      class="house-map__label"
      :fill="INK"
    >Salão 1</text>
    <text
      x="254"
      y="282"
      class="house-map__label"
      :fill="INK"
    >Salão 2</text>
    <text
      x="449"
      y="282"
      class="house-map__label"
      :fill="INK"
    >Anexo</text>
    <text
      x="228"
      y="476"
      text-anchor="end"
      class="house-map__label"
      :fill="INK"
    >Deck</text>
    <text
      x="254"
      y="476"
      class="house-map__label"
      :fill="INK"
    >Área coberta</text>
    <text
      x="626"
      y="561"
      text-anchor="end"
      class="house-map__label"
      :fill="INK"
    >Área descoberta</text>
    <text
      x="227"
      y="531"
      text-anchor="middle"
      transform="rotate(-90 227 531)"
      class="house-map__label house-map__label--tiny"
      :fill="INK"
    >Portaria</text>
  </svg>
</template>

<style scoped>
.house-map {
  font-family: inherit;
}

.house-map__label {
  font-size: 22px;
  font-style: italic;
  font-weight: 700;
}

.house-map__label--feature {
  font-size: 20px;
}

.house-map__label--small {
  font-size: 17px;
}

.house-map__label--tiny {
  font-size: 10px;
}
</style>
