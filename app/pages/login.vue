<script setup lang="ts">

definePageMeta({
  layout: 'blank'
})

const supabase = useSupabaseClient()
const toast = useToast()

const redirect = useRoute().query.redirect as string || undefined

const loading = ref(false)

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
      if (redirect) navigateTo(redirect)
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
  <UContainer class="relative py-8 h-screen">
    <UButton
      icon="i-heroicons-arrow-right-on-rectangle"
      color="neutral"
      variant="link"
      label="Sair"
      class="absolute top-1 right-1"
      @click="logout"
    />
    <div class="flex flex-col items-center justify-center h-full">

      <UPageCard
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
    </div>
  </UContainer>
</template>
