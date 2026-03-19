<script setup lang="ts">

definePageMeta({
  layout: 'painel'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

const loading = ref(false)
const numero = ref('')

const loginFields = ref([
  {
    name: 'email',
    type: 'email' as const,
    label: 'E-mail',
    placeholder: 'seu@email.com',
    required: true
  },
  {
    name: 'password',
    type: 'password' as const,
    label: 'Senha',
    placeholder: '••••••••',
    required: true
  }
])

interface FormData {
  [key: string]: unknown
}

interface FormSubmitEvent {
  data: FormData
}

async function login (event: FormSubmitEvent) {
  loading.value = true
  try {
    const data = event.data
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email as string,
      password: data.password as string
    })

    if (error) {
      toast.add({
        title: 'Erro ao fazer login',
        description: error.message,
        color: 'error'
      })
    } else {
      toast.add({
        title: 'Login realizado com sucesso',
        color: 'success'
      })
    }
  } finally {
    loading.value = false
  }
}

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
    const { error } = await supabase.from('senhas').insert([{ numero: parseInt(numero.value, 10) }])

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
    }
  } finally {
    loading.value = false
  }
}

async function logout () {
  await supabase.auth.signOut()
  toast.add({
    title: 'Logout realizado',
    color: 'info'
  })
}
</script>

<template>
  <UContainer class="py-8 h-screen">
    <div class="flex flex-col items-center justify-center h-full">

      <UPageCard
        v-if="!user"
        class="w-full max-w-md"
      >
        <UAuthForm
          :fields="loginFields"
          title="Login"
          description="Faça login para continuar"
          submit-label="Entrar"
          :loading="loading"
          class="max-w-md w-full"
          @submit="login"
        />
      </UPageCard>

      <UPageCard
        v-else
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

          <UButton
            type="submit"
            block
            size="xl"
            icon="fluent:megaphone-loud-48-filled"
            :loading="loading"
          >
            Chamar Senha
          </UButton>
        </UForm>
      </UPageCard>

    </div>
  </UContainer>
</template>
