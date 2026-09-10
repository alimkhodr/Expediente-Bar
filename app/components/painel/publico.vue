<script setup lang="ts">
import type { Senha } from '~/composables/useSenhas'

defineProps<{
  atual: Senha | null
  historico: Senha[]
  trocou: number
}>()
</script>

<template>
  <div class="painel">
    <header class="painel-header">
      <div class="brand">
        <Logo
          icon
          class="brand-logo"
        />
        <span class="brand-sep" />
        <h1 class="brand-title">Painel de senhas</h1>
      </div>
    </header>

    <div
      v-if="!atual"
      class="painel-empty"
    >
      <div class="card empty-card">Nenhuma senha gerada ainda</div>
    </div>

    <div
      v-else
      class="painel-main"
    >
      <div class="card senha-card">
        <PainelSenhaDisplay
          :numero="atual.numero"
          :nome="atual.nome"
          :trocou="trocou"
          class="senha-atual"
        />
      </div>

      <div class="painel-hist">
        <PainelHistorico
          :senhas="historico"
          :limite="3"
        />
      </div>
    </div>

    <PainelRodape class="painel-footer" />
  </div>
</template>

<style scoped>
/* Painel exibido em TV (Fire TV "tomate", Chrome antigo < 111).
   Tudo aqui evita: oklch, color-mix, @container/cqi e @layer.
   Dimensionamento por unidades de viewport (vmin/vh) -> Chrome ~30+.
   As variaveis --ui-* sao redefinidas em hex para que o que usa
   var(--ui-*) direto (logo SVG, fill da senha) funcione no browser velho. */
.painel {
  /* paleta dark + ambar (equivalente ao tema, porem em hex) */
  --ui-primary: #ffa507;
  --ui-text: #fafafa;
  --ui-text-highlighted: #fafafa;
  --ui-text-muted: #a1a1aa;
  --ui-text-dimmed: #a1a1aa;
  --ui-bg: #09090b;
  --ui-bg-elevated: #18181b;
  --ui-border: #27272a;

  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2vmin;
  padding: 6.5vmin 7vmin;
  background: #09090b;
  color: #fafafa;
  font-family: 'Poppins', sans-serif;
}
.painel :deep(*) {
  box-sizing: border-box;
}

/* cartao base (substitui UCard) */
.card {
  background: #111111;
  border: 1px solid #27272a;
  border-radius: 1.4vmin;
}

/* ---- header ---- */
.painel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2vmin;
  flex-shrink: 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 2vmin;
}
.brand-logo {
  height: 6vmin;
  width: auto;
  color: #fafafa;
}
.brand-sep {
  width: 2px;
  height: 5.5vmin;
  background: #27272a;
  border-radius: 2px;
}
.brand-title {
  margin: 0;
  font-size: 3.2vmin;
  font-weight: 500;
  line-height: 1;
  color: #a1a1aa;
}

/* ---- vazio ---- */
.painel-empty {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-card {
  padding: 3vmin 4vmin;
  font-size: 3vmin;
}

/* ---- conteudo principal ---- */
.painel-main {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: row;
  gap: 2vmin;
}
.senha-card {
  flex: 2 1 0;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2vmin;
}
.senha-atual {
  width: 100%;
  height: 100%;
  min-height: 0;
}
.painel-hist {
  flex: 1 1 0;
  min-height: 0;
}

/* ---- modo retrato (preview no celular) ---- */
@media (orientation: portrait) {
  /* em portrait, vmin usa a largura (lado menor): logo/raios ficam pequenos -> aumenta */
  .brand-logo {
    height: clamp(2.75rem, 11vmin, 4rem);
  }
  .card {
    border-radius: 3vmin;
  }
  .brand-sep,
  .brand-title {
    display: none;
  }
  .painel-main {
    flex-direction: column;
  }
  .senha-card {
    flex: 0 0 auto;
  }
  .senha-atual {
    height: 30vh;
  }
}
</style>
