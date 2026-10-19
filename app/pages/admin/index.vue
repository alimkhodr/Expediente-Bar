<script setup lang="ts">
// Home da área interna: o que existe, para que serve e os números do dia.
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

useSeoMeta({ title: 'Admin', robots: 'noindex, nofollow' })

const supabase = useSupabaseClient()
const toast = useToast()
const { atual } = useSenhas(1)

const TIME_ZONE = 'America/Sao_Paulo'

const saudacao = computed(() => {
  const hora = Number(new Intl.DateTimeFormat('pt-BR', { hour: 'numeric', hourCycle: 'h23', timeZone: TIME_ZONE }).format(new Date()))
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
})
const hoje = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TIME_ZONE }).format(new Date())

/** Meia-noite de hoje em São Paulo (UTC-3, sem horário de verão desde 2019). */
function inicioDoDia (): string {
  const dia = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date())
  return new Date(`${dia}T00:00:00-03:00`).toISOString()
}

const avaliacoes = ref<{ hoje: number, pendentes: number } | null>(null)
const avaliacoesErro = ref(false)
const conteudoAtualizadoEm = ref<string | null>(null)

async function carregar () {
  const [hojeRes, pendentesRes, conteudoRes] = await Promise.all([
    supabase.from('review_requests').select('id', { count: 'exact', head: true }).gte('created_at', inicioDoDia()),
    supabase.from('review_requests').select('id', { count: 'exact', head: true }).is('confirmed_at', null).not('customer_name', 'is', null),
    supabase.from('conteudo').select('atualizado_em').order('atualizado_em', { ascending: false }).limit(1)
  ])
  avaliacoesErro.value = !!(hojeRes.error || pendentesRes.error)
  avaliacoes.value = avaliacoesErro.value ? null : { hoje: hojeRes.count ?? 0, pendentes: pendentesRes.count ?? 0 }
  conteudoAtualizadoEm.value = (conteudoRes.data?.[0] as { atualizado_em: string } | undefined)?.atualizado_em ?? null
}

onMounted(carregar)

const formatarData = (iso: string) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: TIME_ZONE
}).format(new Date(iso))

const resumo = computed(() => [
  {
    label: 'Senha na TV',
    value: atual.value ? formatarSenha(atual.value.numero) : '—',
    hint: atual.value?.nome ?? 'Última chamada',
    icon: 'i-lucide-megaphone',
    to: '/admin/senhas'
  },
  {
    label: 'Avaliações hoje',
    value: avaliacoes.value ? String(avaliacoes.value.hoje) : '—',
    hint: avaliacoesErro.value ? 'Tabela ainda não criada' : 'Envios pela placa',
    icon: 'i-lucide-star',
    to: '/admin/reviews'
  },
  {
    label: 'Para conferir',
    value: avaliacoes.value ? String(avaliacoes.value.pendentes) : '—',
    hint: 'Nomes ainda não achados no Google',
    icon: 'i-lucide-search',
    to: '/admin/reviews'
  },
  {
    label: 'Conteúdo do site',
    value: conteudoAtualizadoEm.value ? formatarData(conteudoAtualizadoEm.value) : 'Padrão',
    hint: 'Última edição',
    icon: 'i-lucide-layout-template',
    to: '/admin/cms'
  }
])

const ferramentas = adminTools.filter(tool => tool.to !== '/admin')
const placas = plaqueLinks.map(link => ({ ...link, url: plaqueUrl(site.url, link) }))

async function copiar (url: string) {
  await navigator.clipboard.writeText(url)
  toast.add({ title: 'Link copiado', description: url, icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <UDashboardPanel id="admin-home">
    <template #header>
      <UDashboardNavbar title="Início" />
    </template>

    <template #body>
      <div class="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div>
          <h1 class="text-2xl font-bold text-highlighted">
            {{ saudacao }}!
          </h1>
          <p class="mt-1 text-muted first-letter:uppercase">
            {{ hoje }}
          </p>
        </div>

        <!-- Números do dia -->
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <NuxtLink
            v-for="item in resumo"
            :key="item.label"
            :to="item.to"
            class="group rounded-lg border border-default bg-elevated/40 p-4 transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <div class="flex items-center justify-between gap-2 text-muted">
              <span class="text-xs font-medium">{{ item.label }}</span>
              <UIcon
                :name="item.icon"
                class="size-4 shrink-0 group-hover:text-primary"
              />
            </div>
            <p class="mt-2 truncate text-2xl font-bold tabular-nums text-highlighted">
              {{ item.value }}
            </p>
            <p class="mt-0.5 truncate text-xs text-dimmed">
              {{ item.hint }}
            </p>
          </NuxtLink>
        </div>

        <UAlert
          v-if="avaliacoesErro"
          color="warning"
          variant="subtle"
          icon="i-lucide-circle-alert"
          title="A placa de avaliação ainda não está salvando"
          description="Falta criar a tabela review_requests no Supabase (arquivo supabase/migrations/20261019000000_review_requests.sql). Os clientes continuam indo para o Google normalmente."
        />

        <!-- Ferramentas -->
        <section>
          <h2 class="mb-3 text-sm font-semibold text-muted">
            Ferramentas
          </h2>
          <UPageGrid class="gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <UPageCard
              v-for="tool in ferramentas"
              :key="tool.to"
              :to="tool.to"
              :title="tool.label"
              :description="tool.description"
              :icon="tool.icon"
              variant="subtle"
            />
          </UPageGrid>
        </section>

        <div class="grid gap-8 lg:grid-cols-2">
          <!-- Placas -->
          <section>
            <h2 class="mb-3 text-sm font-semibold text-muted">
              Links das placas
            </h2>
            <UPageCard
              variant="subtle"
              :ui="{ container: 'p-0 sm:p-0' }"
            >
              <ul class="divide-y divide-default">
                <li
                  v-for="placa in placas"
                  :key="placa.url"
                  class="flex items-center gap-3 px-4 py-3"
                >
                  <UIcon
                    :name="placa.medium === 'nfc' ? 'i-lucide-nfc' : 'i-lucide-qr-code'"
                    class="size-5 shrink-0 text-primary"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-highlighted">
                      {{ placa.label }}
                    </p>
                    <p class="truncate font-mono text-xs text-dimmed">
                      {{ placa.url.replace('https://', '') }}
                    </p>
                  </div>
                  <UButton
                    icon="i-lucide-copy"
                    color="neutral"
                    variant="ghost"
                    :aria-label="`Copiar link ${placa.label}`"
                    @click="copiar(placa.url)"
                  />
                </li>
              </ul>
            </UPageCard>
          </section>

          <!-- Telas públicas e ferramentas externas -->
          <section>
            <h2 class="mb-3 text-sm font-semibold text-muted">
              Atalhos
            </h2>
            <UPageCard
              variant="subtle"
              :ui="{ container: 'p-0 sm:p-0' }"
            >
              <ul class="divide-y divide-default">
                <li
                  v-for="link in [...publicScreens, ...externalTools]"
                  :key="link.to"
                >
                  <NuxtLink
                    :to="link.to"
                    target="_blank"
                    class="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-elevated/60"
                  >
                    <UIcon
                      :name="link.icon"
                      class="size-5 shrink-0 text-muted"
                    />
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-highlighted">
                        {{ link.label }}
                      </p>
                      <p class="truncate text-xs text-dimmed">
                        {{ link.description }}
                      </p>
                    </div>
                    <UIcon
                      name="i-lucide-arrow-up-right"
                      class="size-4 shrink-0 text-dimmed"
                    />
                  </NuxtLink>
                </li>
              </ul>
            </UPageCard>
          </section>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
