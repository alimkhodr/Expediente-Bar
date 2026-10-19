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
    .select('id, waiter_name, source, created_at')
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

const ranking = computed(() => rankWaiters(rows.value))
const totals = computed(() => ({
  all: rows.value.length,
  waiters: ranking.value.length,
  nfc: rows.value.filter(r => r.source === 'nfc').length,
  qr: rows.value.filter(r => r.source === 'qr').length,
  unnamed: rows.value.filter(r => !waiterKey(r.waiter_name)).length
}))

const formatTime = (iso: string) => new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
}).format(new Date(iso))

const sourceLabel: Record<ReviewSource, string> = { nfc: 'NFC', qr: 'QR code', site: 'Site' }

const rankingColumns: TableColumn<WaiterRanking>[] = [
  { id: 'position', header: '#' },
  { accessorKey: 'name', header: 'Garçom' },
  { accessorKey: 'total', header: 'Envios' },
  { accessorKey: 'nfc', header: 'NFC' },
  { accessorKey: 'qr', header: 'QR' },
  { accessorKey: 'lastAt', header: 'Último' }
]

const historyColumns: TableColumn<ReviewRequest>[] = [
  { accessorKey: 'created_at', header: 'Horário' },
  { accessorKey: 'waiter_name', header: 'Garçom' },
  { accessorKey: 'source', header: 'Origem' }
]

/** CSV para conferir com os horários das avaliações no painel do Google. */
function exportCsv () {
  const lines = [['horario', 'garcom', 'origem'].join(';')]
  for (const r of rows.value) lines.push([formatTime(r.created_at), (r.waiter_name ?? '').replace(/;/g, ','), r.source].join(';'))
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
        descricao="Quem os clientes indicaram antes de ir para o Google. Atualiza a cada minuto."
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
        <div class="flex gap-2">
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
            { label: 'Garçons', value: totals.waiters },
            { label: 'Por NFC', value: totals.nfc },
            { label: 'Por QR', value: totals.qr },
            { label: 'Sem nome', value: totals.unnamed }
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
        <template #total-cell="{ row }">
          <span class="font-semibold text-primary">{{ row.original.total }}</span>
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
      </UTable>
    </UPageCard>
  </UContainer>
</template>
