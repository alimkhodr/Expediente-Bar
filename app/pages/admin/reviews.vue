<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'admin', middleware: ['auth'] })
useSeoMeta({ title: 'Placa de avaliação', robots: 'noindex, nofollow' })

const supabase = useSupabaseClient()
const toast = useToast()

type Period = 'today' | '7d' | '30d' | 'all'

const TIME_ZONE = 'America/Sao_Paulo'
const MAX_ROWS = 5000
const REFRESH_MS = 60_000

const periods = [
  { label: 'Hoje', value: 'today' },
  { label: '7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: 'Tudo', value: 'all' }
]

const period = ref<Period>('today')
const rows = ref<ReviewRequest[]>([])
const loading = ref(true)
const loadError = ref<{ missingTable: boolean, message: string } | null>(null)

/** Meia-noite de hoje em São Paulo (sem horário de verão desde 2019: UTC-3). */
function startOf (value: Period): string | null {
  if (value === 'all') return null
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date())
  const start = new Date(`${today}T00:00:00-03:00`)
  if (value === '7d') start.setDate(start.getDate() - 6)
  if (value === '30d') start.setDate(start.getDate() - 29)
  return start.toISOString()
}

async function load () {
  loading.value = true
  let query = supabase
    .from('review_requests')
    .select('id, customer_name, waiter_name, source, confirmed_at, created_at')
    .order('created_at', { ascending: false })
    .limit(MAX_ROWS)
  const start = startOf(period.value)
  if (start) query = query.gte('created_at', start)
  const { data, error } = await query
  loading.value = false
  // Erro fica fixo na tela (o refresh automático empilharia um toast por minuto)
  if (error) {
    loadError.value = { missingTable: error.code === 'PGRST205', message: error.message }
    return
  }
  loadError.value = null
  rows.value = (data ?? []) as ReviewRequest[]
}

watch(period, load)

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  load()
  timer = setInterval(load, REFRESH_MS)
})
onUnmounted(() => clearInterval(timer))

const savingIds = ref(new Set<number>())

/** Marca/desmarca que a avaliação foi encontrada no Google com o nome do cliente. */
async function toggleConfirmed (id: number) {
  // Altera o item reativo da lista (o row.original da tabela pode não ser reativo)
  const row = rows.value.find(r => r.id === id)
  if (!row) return
  const previous = row.confirmed_at
  const next = previous ? null : new Date().toISOString()
  row.confirmed_at = next
  savingIds.value.add(row.id)
  const { error } = await supabase.from('review_requests').update({ confirmed_at: next } as never).eq('id', row.id)
  savingIds.value.delete(row.id)
  if (error) {
    row.confirmed_at = previous
    toast.add({ title: 'Não foi possível salvar a conferência', description: error.message, color: 'error' })
  }
}

const ranking = computed(() => rankWaiters(rows.value))
const totals = computed(() => ({
  all: rows.value.length,
  confirmed: rows.value.filter(r => r.confirmed_at).length,
  waiters: ranking.value.length,
  nfc: rows.value.filter(r => r.source === 'nfc').length,
  qr: rows.value.filter(r => r.source === 'qr').length
}))

const kpis = computed(() => [
  { label: 'Envios', value: totals.value.all, icon: 'i-lucide-send' },
  { label: 'Confirmadas', value: totals.value.confirmed, icon: 'i-lucide-badge-check' },
  { label: 'Garçons', value: totals.value.waiters, icon: 'i-lucide-users' },
  { label: 'Por NFC', value: totals.value.nfc, icon: 'i-lucide-nfc' },
  { label: 'Por QR', value: totals.value.qr, icon: 'i-lucide-qr-code' }
])

const formatTime = (iso: string) => new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
}).format(new Date(iso))

const sourceLabel: Record<ReviewSource, string> = { nfc: 'NFC', qr: 'QR code', site: 'Site' }

const rankingColumns: TableColumn<WaiterRanking>[] = [
  { id: 'position', header: '#' },
  { accessorKey: 'name', header: 'Garçom' },
  { accessorKey: 'confirmed', header: 'Confirmadas' },
  { accessorKey: 'total', header: 'Envios' },
  { accessorKey: 'nfc', header: 'NFC' },
  { accessorKey: 'qr', header: 'QR' },
  { accessorKey: 'lastAt', header: 'Último' }
]

const historyColumns: TableColumn<ReviewRequest>[] = [
  { accessorKey: 'created_at', header: 'Horário' },
  { accessorKey: 'customer_name', header: 'Cliente' },
  { accessorKey: 'waiter_name', header: 'Garçom' },
  { accessorKey: 'source', header: 'Origem' },
  { accessorKey: 'confirmed_at', header: 'No Google?' }
]

const csvCell = (value: string | null) => (value ?? '').replace(/[;\n]/g, ',')

/** CSV para conferir com as avaliações no painel do Google. */
function exportCsv () {
  const lines = [['horario', 'cliente', 'garcom', 'origem', 'confirmada'].join(';')]
  for (const r of rows.value) {
    lines.push([formatTime(r.created_at), csvCell(r.customer_name), csvCell(r.waiter_name), r.source, r.confirmed_at ? 'sim' : 'nao'].join(';'))
  }
  const blob = new Blob([String.fromCharCode(0xFEFF) + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `avaliacoes-${period.value}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

const medal = (i: number) => ['🥇', '🥈', '🥉'][i] ?? `${i + 1}º`
</script>

<template>
  <UDashboardPanel id="reviews">
    <template #header>
      <UDashboardNavbar title="Placa de avaliação">
        <template #right>
          <UButton
            :to="links.googleMaps"
            target="_blank"
            icon="i-simple-icons-googlemaps"
            color="neutral"
            variant="outline"
            class="hidden sm:inline-flex"
          >
            Avaliações no Google
          </UButton>
          <UTooltip text="Avaliações no Google">
            <UButton
              :to="links.googleMaps"
              target="_blank"
              icon="i-simple-icons-googlemaps"
              color="neutral"
              variant="outline"
              aria-label="Avaliações no Google"
              class="sm:hidden"
            />
          </UTooltip>
          <UTooltip text="Baixar CSV">
            <UButton
              icon="i-lucide-download"
              color="neutral"
              variant="outline"
              aria-label="Baixar CSV"
              :disabled="!rows.length"
              @click="exportCsv"
            />
          </UTooltip>
          <UTooltip text="Atualizar">
            <UButton
              icon="i-lucide-refresh-cw"
              color="neutral"
              variant="outline"
              aria-label="Atualizar"
              :loading="loading"
              @click="load"
            />
          </UTooltip>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UTabs
          v-model="period"
          :items="periods"
          :content="false"
          size="sm"
          class="w-full sm:w-auto"
        />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <p class="text-sm text-muted">
          O cliente digita o nome dele na placa antes de ir para o Google. Procure o nome nas avaliações do Google e marque como <strong class="text-default">encontrada</strong>: o ranking conta primeiro as confirmadas. Atualiza a cada minuto.
        </p>

        <UAlert
          v-if="loadError"
          color="warning"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :title="loadError.missingTable ? 'Tabela ainda não criada no Supabase' : 'Não foi possível carregar os envios'"
          :description="loadError.missingTable
            ? 'Rode supabase/migrations/20261019000000_review_requests.sql no SQL Editor do Supabase. Até lá a placa leva o cliente ao Google, mas não salva os nomes.'
            : loadError.message"
        />

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div
            v-for="kpi in kpis"
            :key="kpi.label"
            class="rounded-lg border border-default bg-elevated/40 p-4 last:col-span-2 sm:last:col-span-1"
          >
            <div class="flex items-center justify-between gap-2 text-muted">
              <span class="text-xs font-medium">{{ kpi.label }}</span>
              <UIcon
                :name="kpi.icon"
                class="size-4 shrink-0"
              />
            </div>
            <p class="mt-2 text-2xl font-bold tabular-nums text-highlighted">
              {{ kpi.value }}
            </p>
          </div>
        </div>

        <!-- Ranking -->
        <section>
          <h2 class="mb-3 text-base font-semibold text-highlighted">
            Ranking dos garçons
          </h2>

          <!-- Celular: lista -->
          <ul class="divide-y divide-default rounded-lg border border-default sm:hidden">
            <li
              v-for="(waiter, index) in ranking"
              :key="waiter.key"
              class="flex items-center gap-3 px-4 py-3"
            >
              <span class="w-7 shrink-0 text-center text-lg">{{ medal(index) }}</span>
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium text-highlighted">
                  {{ waiter.name }}
                </p>
                <p class="text-xs text-muted">
                  {{ waiter.total }} envios · {{ waiter.nfc }} NFC · {{ waiter.qr }} QR
                </p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold tabular-nums text-primary">
                  {{ waiter.confirmed }}
                </p>
                <p class="text-xs text-muted">
                  confirmadas
                </p>
              </div>
            </li>
            <li
              v-if="!ranking.length"
              class="px-4 py-6 text-center text-sm text-muted"
            >
              {{ loading ? 'Carregando…' : 'Nenhum envio no período' }}
            </li>
          </ul>

          <!-- Desktop: tabela -->
          <UTable
            :data="ranking"
            :columns="rankingColumns"
            :loading="loading"
            empty="Nenhum envio no período"
            class="hidden rounded-lg border border-default sm:block"
          >
            <template #position-cell="{ row }">
              {{ medal(row.index) }}
            </template>
            <template #name-cell="{ row }">
              <span class="font-medium text-highlighted">{{ row.original.name }}</span>
            </template>
            <template #confirmed-cell="{ row }">
              <span class="font-semibold text-primary">{{ row.original.confirmed }}</span>
            </template>
            <template #lastAt-cell="{ row }">
              {{ formatTime(row.original.lastAt) }}
            </template>
          </UTable>
        </section>

        <!-- Histórico -->
        <section>
          <h2 class="mb-3 text-base font-semibold text-highlighted">
            Envios
          </h2>

          <!-- Celular: cards -->
          <ul class="flex flex-col gap-2 sm:hidden">
            <li
              v-for="row in rows"
              :key="row.id"
              class="rounded-lg border border-default p-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p
                    class="truncate font-medium"
                    :class="row.customer_name ? 'text-highlighted' : 'text-muted'"
                  >
                    {{ row.customer_name || 'Cliente não informado' }}
                  </p>
                  <p class="truncate text-xs text-muted">
                    Atendido por {{ row.waiter_name || '—' }} · {{ formatTime(row.created_at) }}
                  </p>
                </div>
                <UBadge
                  :color="row.source === 'nfc' ? 'primary' : 'neutral'"
                  variant="subtle"
                  class="shrink-0"
                >
                  {{ sourceLabel[row.source] }}
                </UBadge>
              </div>
              <UButton
                v-if="row.customer_name"
                block
                size="sm"
                class="mt-3"
                :color="row.confirmed_at ? 'success' : 'neutral'"
                :variant="row.confirmed_at ? 'subtle' : 'outline'"
                :icon="row.confirmed_at ? 'i-lucide-check' : 'i-lucide-search'"
                :loading="savingIds.has(row.id)"
                @click="toggleConfirmed(row.id)"
              >
                {{ row.confirmed_at ? 'Encontrada no Google' : 'Marcar como encontrada' }}
              </UButton>
            </li>
            <li
              v-if="!rows.length"
              class="rounded-lg border border-default px-4 py-6 text-center text-sm text-muted"
            >
              {{ loading ? 'Carregando…' : 'Nenhum envio no período' }}
            </li>
          </ul>

          <!-- Desktop: tabela -->
          <UTable
            :data="rows"
            :columns="historyColumns"
            :loading="loading"
            empty="Nenhum envio no período"
            class="hidden max-h-[32rem] rounded-lg border border-default sm:block"
            sticky
          >
            <template #created_at-cell="{ row }">
              <span class="tabular-nums">{{ formatTime(row.original.created_at) }}</span>
            </template>
            <template #customer_name-cell="{ row }">
              <span :class="row.original.customer_name ? 'font-medium text-highlighted' : 'text-muted'">{{ row.original.customer_name || 'Não informado' }}</span>
            </template>
            <template #waiter_name-cell="{ row }">
              <span :class="row.original.waiter_name ? '' : 'text-muted'">{{ row.original.waiter_name || '—' }}</span>
            </template>
            <template #source-cell="{ row }">
              <UBadge
                :color="row.original.source === 'nfc' ? 'primary' : 'neutral'"
                variant="subtle"
              >
                {{ sourceLabel[row.original.source] }}
              </UBadge>
            </template>
            <template #confirmed_at-cell="{ row }">
              <UButton
                v-if="row.original.customer_name"
                size="xs"
                :color="row.original.confirmed_at ? 'success' : 'neutral'"
                :variant="row.original.confirmed_at ? 'subtle' : 'outline'"
                :icon="row.original.confirmed_at ? 'i-lucide-check' : 'i-lucide-search'"
                :loading="savingIds.has(row.original.id)"
                :aria-label="row.original.confirmed_at ? 'Desmarcar avaliação encontrada' : 'Marcar avaliação como encontrada no Google'"
                @click="toggleConfirmed(row.original.id)"
              >
                {{ row.original.confirmed_at ? 'Encontrada' : 'Conferir' }}
              </UButton>
              <span
                v-else
                class="text-xs text-dimmed"
              >sem nome</span>
            </template>
          </UTable>
        </section>
      </div>
    </template>
  </UDashboardPanel>
</template>
