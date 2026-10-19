<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

useSeoMeta({ title: 'Entrar', robots: 'noindex, nofollow' })

const supabase = useSupabaseClient()
const toast = useToast()
const user = useSupabaseUser()

const redirect = useRoute().query.redirect as string || '/admin'

const loading = ref(false)

watch(user, (newUser) => {
  if (newUser) {
    navigateTo(redirect)
  }
}, { immediate: true })

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
      navigateTo(redirect)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="flex min-h-svh flex-col items-center justify-center gap-8 bg-default px-4 py-10">
    <img
      src="/logo.svg"
      alt="Expediente Bar"
      width="476"
      height="151"
      class="h-10 w-auto"
    />
    <UPageCard class="w-full max-w-sm">
      <UAuthForm
        :fields="loginFields"
        title="Área da equipe"
        description="Entre com o e-mail cadastrado no Supabase."
        icon="i-lucide-lock"
        :submit="{ label: 'Entrar' }"
        :loading="loading"
        @submit="login"
      />
    </UPageCard>
  </main>
</template>
