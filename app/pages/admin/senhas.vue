<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

useSeoMeta({ title: 'Chamar senha', robots: 'noindex, nofollow' })

const supabase = useSupabaseClient()
const toast = useToast()
const { atual, historico } = useSenhas(6)

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
</script>

<template>
  <UDashboardPanel id="senhas">
    <template #header>
      <UDashboardNavbar title="Chamar senha">
        <template #right>
          <UButton
            to="/tv"
            target="_blank"
            icon="i-lucide-tv"
            color="neutral"
            variant="outline"
            label="Abrir TV"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[1fr_18rem]">
        <UPageCard
          title="Nova chamada"
          description="A senha aparece na TV do balcão na hora."
        >
          <UForm
            :state="{ numero }"
            class="space-y-5"
            @submit="chamarSenha"
          >
            <UFormField
              label="Número da senha"
              name="numero"
              required
            >
              <UInput
                v-model="numero"
                type="number"
                inputmode="numeric"
                placeholder="123"
                min="1"
                max="999"
                size="xl"
                :disabled="loading"
                class="w-full"
                :ui="{ base: 'text-2xl font-bold' }"
              />
            </UFormField>

            <UFormField
              label="Nome"
              name="nome"
              hint="opcional"
            >
              <UInput
                v-model="nome"
                placeholder="Ex.: Jihad"
                size="xl"
                :disabled="loading"
                class="w-full"
              />
            </UFormField>

            <div class="grid gap-3 sm:grid-cols-2">
              <UButton
                type="submit"
                block
                size="xl"
                icon="i-lucide-megaphone"
                :loading="loading"
              >
                Chamar senha
              </UButton>
              <UButton
                block
                size="xl"
                color="neutral"
                variant="subtle"
                icon="i-lucide-scan-line"
                label="Escanear comanda"
                :disabled="loading"
                @click="escanearAberto = true"
              />
            </div>
          </UForm>
        </UPageCard>

        <UPageCard
          title="Na TV agora"
          :ui="{ container: 'gap-y-4' }"
        >
          <div
            v-if="atual"
            class="rounded-lg bg-primary/10 px-4 py-3"
          >
            <p class="text-4xl font-bold tabular-nums text-primary">
              {{ formatarSenha(atual.numero) }}
            </p>
            <p
              v-if="atual.nome"
              class="truncate text-sm text-muted"
            >
              {{ atual.nome }}
            </p>
          </div>
          <p
            v-else
            class="text-sm text-muted"
          >
            Nenhuma senha chamada ainda.
          </p>

          <ul
            v-if="historico.length"
            class="divide-y divide-default"
          >
            <li
              v-for="senha in historico"
              :key="senha.id"
              class="flex items-baseline justify-between gap-3 py-2"
            >
              <span class="font-semibold tabular-nums">{{ formatarSenha(senha.numero) }}</span>
              <span class="truncate text-sm text-muted">{{ senha.nome }}</span>
            </li>
          </ul>
        </UPageCard>
      </div>

      <PainelEscanearComanda
        v-model:open="escanearAberto"
        @confirm="lancarDoScan"
      />
    </template>
  </UDashboardPanel>
</template>
