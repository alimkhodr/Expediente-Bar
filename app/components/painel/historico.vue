<script setup lang="ts">
import type { Senha } from '~/composables/useSenhas'

const props = withDefaults(defineProps<{
  senhas: Senha[]
  limite?: number
}>(), {
  limite: 0
})

const itens = computed(() => props.limite > 0 ? props.senhas.slice(0, props.limite) : props.senhas)
</script>

<template>
  <div class="hist">
    <span class="hist-label">Últimas senhas</span>
    <div class="hist-grid">
      <div
        v-for="s in itens"
        :key="s.id"
        class="card hist-item"
      >
        <PainelSenhaDisplay
          :numero="s.numero"
          :nome="s.nome"
          variante="historico"
          class="hist-senha"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fire TV, Chrome antigo: so vmin/hex (sem Nuxt UI, cqi, oklch). */
.hist {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1vmin;
  min-height: 0;
}
.hist-label {
  color: #a1a1aa;
  font-size: 5vmin;
}
/* flex-column com itens flex:1 = linhas de altura igual (substitui grid auto-rows-fr) */
.hist-grid {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 2vmin;
  min-height: 0;
}
.hist-item {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5vmin;
  border: 1px solid #27272a;
  border-radius: 1.4vmin;
}
.hist-senha {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  min-height: 0;
}

/* no mobile (portrait) o vmin encolhe -> raio maior pra acompanhar */
@media (orientation: portrait) {
  .hist-item {
    border-radius: 3vmin;
  }
}
</style>
