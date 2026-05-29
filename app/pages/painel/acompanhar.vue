<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const { atual, historico, trocou } = useSenhas()
const { minhaSenha, erro, acompanhando, faltam, ehSuaVez, acompanhar, limpar } = useAcompanhamento(atual)
</script>

<template>
  <div class="min-h-screen w-full bg-default text-default max-w-md mx-auto flex flex-col gap-5 p-4">
    <header class="flex items-center justify-between">
      <a href="#home">
        <Logo class="h-7" />
      </a>
      <UBadge
        color="success"
        variant="soft"
      >
        AO VIVO
      </UBadge>
    </header>

    <PainelAcompanharChamando
      :numero="atual?.numero ?? null"
      :trocou="trocou"
    />

    <PainelAcompanharSuaVez
      v-if="ehSuaVez && minhaSenha != null"
      :minha-senha="minhaSenha"
      @outra="limpar"
    />
    <PainelAcompanharAcompanhando
      v-else-if="acompanhando && minhaSenha != null && faltam != null"
      :minha-senha="minhaSenha"
      :faltam="faltam"
      @alterar="limpar"
    />
    <PainelAcompanharSelecionar
      v-else
      :base="atual?.numero ?? 1"
      :erro="erro"
      @acompanhar="acompanhar"
    />

    <PainelAcompanharCarrossel :senhas="historico" />

    <p class="text-muted text-xs text-center mt-auto pt-4 flex items-center justify-center gap-2">
      <UIcon name="i-heroicons-shopping-bag" />
      Pegou sua senha no balcão? Informe o número acima para ser avisado.
    </p>
  </div>
</template>
