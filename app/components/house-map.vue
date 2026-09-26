<script setup lang="ts">
/**
 * Mapa ilustrativo da casa (SVG inline): três ambientes na frente (Salão 1, Salão 2 com palco,
 * Anexo com telão), deck e área coberta atrás, e a área descoberta com a portaria.
 * Inline para herdar a fonte do site, destacar a área sob o mouse e ter descrição acessível.
 */
interface Area { id: string, label: string, x: number, y: number, w: number, h: number, hint: string }

const areas: Area[] = [
  { id: 'salao-1', label: 'Salão 1', x: 40, y: 40, w: 330, h: 400, hint: 'Salão interno' },
  { id: 'salao-2', label: 'Salão 2', x: 390, y: 40, w: 330, h: 400, hint: 'Salão com palco' },
  { id: 'anexo', label: 'Anexo', x: 740, y: 40, w: 330, h: 400, hint: 'Anexo com telão' },
  { id: 'deck', label: 'Deck', x: 40, y: 460, w: 330, h: 300, hint: 'Deck externo' },
  { id: 'area-coberta', label: 'Área coberta', x: 390, y: 460, w: 330, h: 300, hint: 'Área externa coberta' },
  { id: 'area-descoberta', label: 'Área descoberta', x: 740, y: 460, w: 330, h: 300, hint: 'Área externa descoberta, ao ar livre' }
]

const active = ref<string | null>(null)
</script>

<template>
  <svg
    viewBox="0 0 1110 900"
    role="img"
    aria-labelledby="house-map-title house-map-desc"
    class="house-map h-auto w-full"
    @mouseleave="active = null"
  >
    <title id="house-map-title">Mapa da casa do Expediente Bar</title>
    <desc id="house-map-desc">
      Na frente: Salão 1, Salão 2 com o palco e Anexo com o telão. Atrás: deck, área coberta e área descoberta.
      A portaria fica na área descoberta, ao lado do deck.
    </desc>

    <defs>
      <pattern
        id="house-map-dots"
        width="18"
        height="18"
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx="9"
          cy="9"
          r="1.4"
          fill="rgba(0,0,0,0.14)"
        />
      </pattern>
    </defs>

    <!-- Ambientes -->
    <g
      v-for="a in areas"
      :key="a.id"
      class="house-map__area"
      :class="{ 'is-active': active === a.id, 'is-dimmed': active && active !== a.id }"
      @mouseenter="active = a.id"
    >
      <title>{{ a.hint }}</title>
      <rect
        :x="a.x"
        :y="a.y"
        :width="a.w"
        :height="a.h"
        rx="22"
        class="house-map__fill"
      />
      <rect
        :x="a.x"
        :y="a.y"
        :width="a.w"
        :height="a.h"
        rx="22"
        fill="url(#house-map-dots)"
        pointer-events="none"
      />
      <text
        :x="a.x + 24"
        :y="a.y + a.h - 26"
        class="house-map__label"
      >{{ a.label }}</text>
    </g>

    <!-- Palco (Salão 2) -->
    <g class="house-map__feature">
      <rect
        x="470"
        y="70"
        width="170"
        height="120"
        rx="16"
      />
      <path
        d="M540 120a12 12 0 1 0 24 0v-18a12 12 0 1 0-24 0zM531 118a21 21 0 0 0 42 0M552 139v10M541 149h22"
        class="house-map__icon"
      />
      <text
        x="555"
        y="176"
        text-anchor="middle"
        class="house-map__feature-label"
      >Palco</text>
    </g>

    <!-- Telão (Anexo) -->
    <g class="house-map__feature">
      <rect
        x="790"
        y="70"
        width="230"
        height="84"
        rx="12"
      />
      <path
        d="M872 92h56v26h-56zM890 118h20M896 124h8"
        class="house-map__icon"
      />
      <text
        x="905"
        y="145"
        text-anchor="middle"
        class="house-map__feature-label"
      >Telão</text>
    </g>

    <!-- Portaria: entrada pela área descoberta -->
    <g class="house-map__entrance">
      <rect
        x="740"
        y="560"
        width="12"
        height="90"
        rx="4"
        class="house-map__door"
      />
      <path
        d="M700 605h30m-10-10l10 10-10 10"
        class="house-map__arrow"
      />
      <text
        x="768"
        y="612"
        class="house-map__small"
      >Portaria</text>
    </g>

    <!-- Legenda -->
    <g class="house-map__legend">
      <rect
        x="40"
        y="800"
        width="22"
        height="22"
        rx="6"
        class="house-map__legend-fill"
      />
      <text
        x="72"
        y="817"
        class="house-map__small"
      >Ambientes com mesas</text>
      <rect
        x="330"
        y="800"
        width="22"
        height="22"
        rx="6"
        class="house-map__legend-dark"
      />
      <text
        x="362"
        y="817"
        class="house-map__small"
      >Palco e telão</text>
      <path
        d="M560 811h30m-10-10l10 10-10 10"
        class="house-map__arrow"
      />
      <text
        x="605"
        y="817"
        class="house-map__small"
      >Entrada</text>
    </g>
  </svg>
</template>

<style scoped>
.house-map {
  font-family: inherit;
}

.house-map__fill {
  fill: var(--ui-primary);
  stroke: #000;
  stroke-width: 6;
  transition: fill 0.2s ease, opacity 0.2s ease;
}

.house-map__area {
  cursor: default;
}

.house-map__area.is-active .house-map__fill {
  fill: #ffb733;
}

.house-map__area.is-dimmed {
  opacity: 0.55;
}

.house-map__label {
  fill: #000;
  font-size: 34px;
  font-weight: 700;
  font-style: italic;
  pointer-events: none;
}

.house-map__feature rect {
  fill: #0a0a0a;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 2;
}

.house-map__feature-label {
  fill: #fff;
  font-size: 26px;
  font-weight: 700;
  font-style: italic;
}

.house-map__icon {
  fill: none;
  stroke: var(--ui-primary);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.house-map__door {
  fill: #000;
}

.house-map__arrow {
  fill: none;
  stroke: #fff;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.house-map__small {
  fill: #fff;
  font-size: 20px;
  font-weight: 600;
}

.house-map__entrance .house-map__small {
  fill: #000;
}

.house-map__legend-fill {
  fill: var(--ui-primary);
}

.house-map__legend-dark {
  fill: #0a0a0a;
  stroke: rgba(255, 255, 255, 0.25);
  stroke-width: 2;
}
</style>
