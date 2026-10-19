<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'blank', middleware: ['auth'] })
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
  if (error) {
    toast.add({ title: 'Não foi possível carregar os envios', description: error.message, color: 'error' })
    return
  }
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
  <UContainer class="max-w-5xl py-8">
    <UPageCard>
      <PainelAdminHeader
        titulo="Placa de avaliação"
        descricao="Confira o nome do cliente nas avaliações do Google e marque as encontradas. Atualiza a cada minuto."
        :links="[
          { label: 'Senhas', to: '/admin', icon: 'i-lucide-hash' },
          { label: 'Conteúdo do site', to: '/admin/cms', icon: 'i-lucide-layout-template' }
        ]"
      />

      <div class="flex flex-wrap items-center justify-between gap-3">
        <UTabs
          v-model="period"
          :items="periods"
          :content="false"
        />
        <div class="flex flex-wrap gap-2">
          <UButton
            :to="links.googleMaps"
            target="_blank"
            icon="i-simple-icons-googlemaps"
            color="neutral"
            variant="outline"
          >
            Avaliações no Google
          </UButton>
          <UButton
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="outline"
            :loading="loading"
            @click="load"
          >
            Atualizar
          </UButton>
          <UButton
            icon="i-lucide-download"
            color="neutral"
            variant="outline"
            :disabled="!rows.length"
            @click="exportCsv"
          >
            CSV
          </UButton>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <UCard
          v-for="kpi in [
            { label: 'Envios', value: totals.all },
            { label: 'Confirmadas', value: totals.confirmed },
            { label: 'Garçons', value: totals.waiters },
            { label: 'Por NFC', value: totals.nfc },
            { label: 'Por QR', value: totals.qr }
          ]"
          :key="kpi.label"
          :ui="{ body: 'p-4 sm:p-4' }"
        >
          <p class="text-xs text-muted">
            {{ kpi.label }}
          </p>
          <p class="text-2xl font-bold">
            {{ kpi.value }}
          </p>
        </UCard>
      </div>

      <h2 class="mt-8 mb-3 text-lg font-semibold">
        Ranking
      </h2>
      <UTable
        :data="ranking"
        :columns="rankingColumns"
        :loading="loading"
        empty="Nenhum envio no período"
      >
        <template #position-cell="{ row }">
          {{ medal(row.index) }}
        </template>
        <template #confirmed-cell="{ row }">
          <span class="font-semibold text-primary">{{ row.original.confirmed }}</span>
        </template>
        <template #lastAt-cell="{ row }">
          {{ formatTime(row.original.lastAt) }}
        </template>
      </UTable>

      <h2 class="mt-8 mb-3 text-lg font-semibold">
        Histórico
      </h2>
      <UTable
        :data="rows"
        :columns="historyColumns"
        :loading="loading"
        empty="Nenhum envio no período"
        class="max-h-[28rem]"
        sticky
      >
        <template #created_at-cell="{ row }">
          {{ formatTime(row.original.created_at) }}
        </template>
        <template #customer_name-cell="{ row }">
          <span :class="row.original.customer_name ? 'font-medium' : 'text-muted'">{{ row.original.customer_name || 'Não informado' }}</span>
        </template>
        <template #waiter_name-cell="{ row }">
          <span :class="row.original.waiter_name ? '' : 'text-muted'">{{ row.original.waiter_name || 'Sem nome' }}</span>
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
        </template>
      </UTable>
    </UPageCard>
  </UContainer>
</template>
