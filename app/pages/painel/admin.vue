<script setup lang="ts">

definePageMeta({
  layout: 'blank',
  middleware: ['auth']
})

const supabase = useSupabaseClient()
const toast = useToast()

const loading = ref(false)
const numero = ref('')
const nome = ref('')
const escanearAberto = ref(false)

async function chamarSenha () {
  if (!numero.value) {
    toast.add({ title: 'Digite um número', color: 'warning' })
    return
  }

  const numeroInt = parseInt(numero.value, 10)
  if (numeroInt > 999) {
    toast.add({ title: 'O número deve ser até 999', color: 'warning' })
    return
  }

  loading.value = true
  try {
    // @ts-expect-error - Supabase schema may not be defined
    const { error } = await supabase.from('senhas').insert([{ numero: numeroInt, nome: nome.value.trim() || null }])

    if (error) {
      toast.add({
        title: 'Erro ao chamar senha',
        description: error.message,
        color: 'error'
      })
    } else {
      toast.add({
        title: 'Senha chamada com sucesso',
        description: `Senha ${numero.value} foi chamada`,
        color: 'success'
      })
      numero.value = ''
      nome.value = ''
    }
  } finally {
    loading.value = false
  }
}

async function lancarDoScan (payload: { nome: string | null, numero: number }) {
  numero.value = String(payload.numero)
  nome.value = payload.nome ?? ''
  await chamarSenha()
}

async function logout () {
  await supabase.auth.signOut()
  toast.add({
    title: 'Logout realizado',
    color: 'info'
  })
  navigateTo('/login')
}
</script>

<template>
  <UContainer class="flex flex-col items-center justify-center py-8 h-screen">
    <UPageCard
      class="w-full max-w-md"
    >
      <div class="flex items-start justify-between mb-6">
        <div>
          <h2 class="text-xl font-semibold">Chamar Senha</h2>
          <p class="text-sm text-muted mt-1">Digite o número da senha</p>
        </div>
        <UButton
          icon="i-heroicons-arrow-right-on-rectangle"
          color="neutral"
          variant="link"
          label="Sair"
          @click="logout"
        />
      </div>

      <UForm
        :state="{ numero }"
        class="space-y-6"
        @submit="chamarSenha"
      >
        <UFormField
          label="Número da Senha"
          name="numero"
          required
        >
          <UInput
            v-model="numero"
            type="number"
            placeholder="123"
            min="1"
            max="999"
            size="xl"
            :disabled="loading"
            class="w-full font-bold"
          />
        </UFormField>

        <UFormField
          label="Nome (opcional)"
          name="nome"
        >
          <UInput
            v-model="nome"
            placeholder="Jihad"
            size="xl"
            :disabled="loading"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          size="xl"
          icon="fluent:megaphone-loud-48-filled"
          :loading="loading"
        >
          Chamar Senha
        </UButton>

        <UButton
          block
          size="xl"
          color="neutral"
          variant="subtle"
          icon="i-heroicons-qr-code"
          label="Escanear comanda"
          :disabled="loading"
          @click="escanearAberto = true"
        />
      </UForm>
    </UPageCard>

    <PainelEscanearComanda
      v-model:open="escanearAberto"
      @confirm="lancarDoScan"
    />
  </UContainer>
</template>
