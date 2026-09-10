<!-- Vue Bits · https://vue-bits.dev · MIT · adaptado: cores/raio via props, conteúdo interno estilizado pelo pai -->
<template>
  <component
    :is="as"
    :class="['relative inline-block overflow-hidden', customClass]"
    :style="{ padding: `${thickness}px 0`, borderRadius: radius }"
  >
    <div
      class="absolute right-[-250%] bottom-[-11px] z-0 h-[50%] w-[300%] rounded-full opacity-70 animate-star-movement-bottom"
      :style="{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }"
      aria-hidden="true"
    />
    <div
      class="absolute left-[-250%] top-[-10px] z-0 h-[50%] w-[300%] rounded-full opacity-70 animate-star-movement-top"
      :style="{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }"
      aria-hidden="true"
    />
    <div
      class="relative z-10 border"
      :style="{ borderRadius: radius, background: innerBackground, borderColor: innerBorder }"
    >
      <slot />
    </div>
  </component>
</template>

<script setup lang="ts">
interface StarBorderProps {
  as?: string
  customClass?: string
  color?: string
  speed?: string
  thickness?: number
  radius?: string
  innerBackground?: string
  innerBorder?: string
}

withDefaults(defineProps<StarBorderProps>(), {
  as: 'div',
  customClass: '',
  color: 'white',
  speed: '6s',
  thickness: 1,
  radius: '9999px',
  innerBackground: '#0b0b0b',
  innerBorder: '#333'
})
</script>

<style>
@keyframes star-movement-bottom {
  0% { transform: translate(0%, 0%); opacity: 1; }
  100% { transform: translate(-100%, 0%); opacity: 0; }
}
@keyframes star-movement-top {
  0% { transform: translate(0%, 0%); opacity: 1; }
  100% { transform: translate(100%, 0%); opacity: 0; }
}
.animate-star-movement-bottom { animation: star-movement-bottom linear infinite alternate; }
.animate-star-movement-top { animation: star-movement-top linear infinite alternate; }
</style>
