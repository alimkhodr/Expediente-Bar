<script setup lang="ts">
const { hora, data } = useRelogio()
</script>

<template>
  <footer class="rodape">
    <span class="rodape-left">
      <span class="rodape-badge">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </span>
      Retire seu pedido no balcão
    </span>
    <span class="rodape-right">
      <span class="rodape-data">{{ data }}</span>
      <span class="rodape-hora">{{ hora }}</span>
    </span>
  </footer>
</template>

<style scoped>
.rodape {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2vmin;
  color: #a1a1aa;
  font-size: 3vmin;
}
.rodape-left {
  display: flex;
  align-items: center;
  gap: 1.2vmin;
}
.rodape-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7vmin;
  border: 1px solid #27272a;
  border-radius: 1vmin;
  color: #ffa507;
}
.rodape-badge svg {
  width: 2.6vmin;
  height: 2.6vmin;
}
.rodape-right {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5vmin;
  text-align: right;
}
.rodape-hora {
  color: #fafafa;
  font-weight: 700;
  font-size: 4vmin;
}
@media (orientation: portrait) {
  .rodape-data {
    display: none;
  }
  /* vmin encolhe no portrait -> raio maior */
  .rodape-badge {
    border-radius: 2vmin;
  }
}
</style>
