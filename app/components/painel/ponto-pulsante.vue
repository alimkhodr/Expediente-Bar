<template>
  <span class="ponto-wrap">
    <span class="ponto-ring" />
    <span class="ponto-core" />
  </span>
</template>

<style scoped>
.ponto-wrap {
  position: relative;
  display: inline-block;
  width: 0.7em;
  height: 0.7em;
  vertical-align: middle;
}
.ponto-ring,
.ponto-core {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: var(--color-yellow-500, #ffa507);
}
.ponto-core {
  transform: scale(0.55);
}
.ponto-ring {
  animation: ponto-ping 1.3s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes ponto-ping {
  0% {
    transform: scale(0.55);
    opacity: 0.85;
  }
  80%,
  100% {
    transform: scale(1.9);
    opacity: 0;
  }
}
</style>
