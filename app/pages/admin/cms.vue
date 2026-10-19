<script setup lang="ts">
import type { Conteudo, ChaveConteudo, LinkHero, Destaque, ItemAgenda, PerguntaFaq } from '~/types/conteudo'
import { conteudoPadrao } from '~/utils/conteudo-padrao'

definePageMeta({ layout: 'admin', middleware: ['auth'] })
useSeoMeta({ title: 'Conteúdo do site', robots: 'noindex, nofollow' })

const supabase = useSupabaseClient()
const toast = useToast()

const CHAVES: { chave: ChaveConteudo; label: string; icon: string; ajuda: string }[] = [
  { chave: 'links', label: 'Links do início', icon: 'i-lucide-link', ajuda: 'Botões da primeira tela. Os três primeiros viram botões grandes; os demais ficam em botões menores. Use # para âncoras da home, / para páginas internas ou https:// para links externos.' },
  { chave: 'destaques', label: 'Destaques', icon: 'i-lucide-sparkles', ajuda: 'Os três cards com foto logo abaixo do início. A imagem é um caminho da pasta /images (ex.: /images/galeria/foto-01.webp).' },
  { chave: 'agenda', label: 'Agenda semanal', icon: 'i-lucide-calendar-days', ajuda: 'A programação fixa da semana e o embed da agenda do Canva (link terminado em ?embed).' },
  { chave: 'faq', label: 'Perguntas frequentes', icon: 'i-lucide-circle-help', ajuda: 'Também vira dado estruturado para o Google (rich results de FAQ).' }
]

const aba = ref<ChaveConteudo>('links')
const conteudo = ref<Conteudo>(structuredClone(conteudoPadrao))
const origem = ref<Record<ChaveConteudo, 'cms' | 'padrao'>>({ links: 'padrao', destaques: 'padrao', agenda: 'padrao', faq: 'padrao' })
const carregando = ref(true)
const salvando = ref<ChaveConteudo | null>(null)
const publicando = ref(false)

const id = () => Math.random().toString(36).slice(2, 9)

async function carregar () {
  carregando.value = true
  const { data, error } = await supabase.from('conteudo').select('chave,valor')
  if (error) {
    toast.add({ title: 'Não foi possível carregar o conteúdo', description: error.message, color: 'error' })
  } else {
    for (const linha of data ?? []) {
      const chave = linha.chave as ChaveConteudo
      if (chave in conteudo.value && linha.valor) {
        ;(conteudo.value as Record<string, unknown>)[chave] = linha.valor
        origem.value[chave] = 'cms'
      }
    }
  }
  carregando.value = false
}

async function salvar (chave: ChaveConteudo) {
  salvando.value = chave
  const { error } = await supabase
    .from('conteudo')
    .upsert({ chave, valor: conteudo.value[chave] } as never, { onConflict: 'chave' })
  salvando.value = null
  if (error) {
    toast.add({ title: 'Erro ao salvar', description: error.message, color: 'error' })
    return
  }
  origem.value[chave] = 'cms'
  toast.add({ title: 'Salvo!', description: 'O site atualiza em até 5 minutos.', color: 'success', icon: 'i-lucide-check' })
}

async function restaurarPadrao (chave: ChaveConteudo) {
  if (!confirm('Descartar o conteúdo salvo e voltar ao padrão do site?')) return
  const { error } = await supabase.from('conteudo').delete().eq('chave', chave)
  if (error) {
    toast.add({ title: 'Erro ao restaurar', description: error.message, color: 'error' })
    return
  }
  ;(conteudo.value as Record<string, unknown>)[chave] = structuredClone(conteudoPadrao[chave])
  origem.value[chave] = 'padrao'
  toast.add({ title: 'Padrão restaurado', color: 'success' })
}

async function verNoSite () {
  publicando.value = true
  await $fetch('/api/conteudo', { query: { t: Date.now() } }).catch(() => {})
  publicando.value = false
  window.open('/', '_blank', 'noopener')
}

onMounted(carregar)

const novoLink = (): LinkHero => ({ id: id(), titulo: 'Novo link', descricao: '', icone: 'i-lucide-sparkles', url: 'https://', ativo: true })
const novoDestaque = (): Destaque => ({ id: id(), titulo: 'Novo destaque', texto: '', imagem: '/images/galeria/foto-01.webp', botao: 'Saiba mais', url: 'https://', icone: 'i-lucide-sparkles', ativo: true })
const novoItemAgenda = (): ItemAgenda => ({ id: id(), dia: 'Dia da semana', descricao: '', icone: 'i-lucide-music' })
const novaPergunta = (): PerguntaFaq => ({ id: id(), question: 'Nova pergunta?', answer: '' })

const abas = CHAVES.map(c => ({ label: c.label, value: c.chave, icon: c.icon }))
const abaAtual = computed(() => CHAVES.find(c => c.chave === aba.value)!)
</script>

<template>
  <UDashboardPanel id="cms">
    <template #header>
      <UDashboardNavbar title="Conteúdo do site">
        <template #right>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-external-link"
            :loading="publicando"
            @click="verNoSite"
          >
            Ver site
          </UButton>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="overflow-x-auto">
        <UTabs
          v-model="aba"
          :items="abas"
          :content="false"
          size="sm"
          variant="link"
          class="min-w-max"
        />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-4xl">
        <p class="mb-6 text-sm text-muted">
          Tudo que não vem de uma API. Eventos, horários e avaliações do Google são automáticos.
        </p>

        <div
          v-if="carregando"
          class="flex flex-col gap-3"
          aria-busy="true"
        >
          <USkeleton
            v-for="n in 3"
            :key="n"
            class="h-24"
          />
        </div>

        <div
          v-else
          class="flex flex-col gap-6"
        >
          <UAlert
            :description="abaAtual.ajuda"
            color="neutral"
            variant="subtle"
            icon="i-lucide-info"
          />

          <!-- LINKS -->
          <AdminListaOrdenavel
            v-if="aba === 'links'"
            v-model="conteudo.links"
            :novo="novoLink"
            rotulo-adicionar="Adicionar link"
            :titulo="(item) => item.titulo"
          >
            <template #default="{ item }">
              <div class="grid gap-3 sm:grid-cols-2">
                <UFormField label="Título">
                  <UInput
                    v-model="item.titulo"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Descrição curta">
                  <UInput
                    v-model="item.descricao"
                    class="w-full"
                  />
                </UFormField>
                <UFormField
                  label="URL"
                  help="#agenda, /cardapio ou https://…"
                >
                  <UInput
                    v-model="item.url"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Ícone">
                  <AdminCampoIcone v-model="item.icone" />
                </UFormField>
                <UFormField label="Visível no site">
                  <USwitch v-model="item.ativo" />
                </UFormField>
              </div>
            </template>
          </AdminListaOrdenavel>

          <!-- DESTAQUES -->
          <AdminListaOrdenavel
            v-if="aba === 'destaques'"
            v-model="conteudo.destaques"
            :novo="novoDestaque"
            rotulo-adicionar="Adicionar destaque"
            :titulo="(item) => item.titulo"
          >
            <template #default="{ item }">
              <div class="grid gap-3 sm:grid-cols-2">
                <UFormField label="Título">
                  <UInput
                    v-model="item.titulo"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Texto do botão">
                  <UInput
                    v-model="item.botao"
                    class="w-full"
                  />
                </UFormField>
                <UFormField
                  label="Texto"
                  class="sm:col-span-2"
                >
                  <UTextarea
                    v-model="item.texto"
                    :rows="2"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="URL do botão">
                  <UInput
                    v-model="item.url"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Ícone">
                  <AdminCampoIcone v-model="item.icone!" />
                </UFormField>
                <UFormField
                  label="Imagem"
                  help="Caminho em /images/…"
                >
                  <UInput
                    v-model="item.imagem"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Visível no site">
                  <USwitch v-model="item.ativo" />
                </UFormField>
              </div>
            </template>
          </AdminListaOrdenavel>

          <!-- AGENDA -->
          <div
            v-if="aba === 'agenda'"
            class="flex flex-col gap-6"
          >
            <div class="grid gap-3 sm:grid-cols-2">
              <UFormField
                label="Embed do Canva"
                help="Link de compartilhamento do Canva terminado em ?embed"
              >
                <UInput
                  v-model="conteudo.agenda.canvaEmbed"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Link público da agenda"
                help="Instagram ou Canva"
              >
                <UInput
                  v-model="conteudo.agenda.linkPublico"
                  class="w-full"
                />
              </UFormField>
            </div>
            <AdminListaOrdenavel
              v-model="conteudo.agenda.itens"
              :novo="novoItemAgenda"
              rotulo-adicionar="Adicionar dia"
              :titulo="(item) => item.dia"
            >
              <template #default="{ item }">
                <div class="grid gap-3 sm:grid-cols-3">
                  <UFormField label="Dia">
                    <UInput
                      v-model="item.dia"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField label="Descrição">
                    <UInput
                      v-model="item.descricao"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField label="Ícone">
                    <AdminCampoIcone v-model="item.icone" />
                  </UFormField>
                </div>
              </template>
            </AdminListaOrdenavel>
          </div>

          <!-- FAQ -->
          <AdminListaOrdenavel
            v-if="aba === 'faq'"
            v-model="conteudo.faq"
            :novo="novaPergunta"
            rotulo-adicionar="Adicionar pergunta"
            :titulo="(item) => item.question"
          >
            <template #default="{ item }">
              <div class="flex flex-col gap-3">
                <UFormField label="Pergunta">
                  <UInput
                    v-model="item.question"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Resposta">
                  <UTextarea
                    v-model="item.answer"
                    :rows="3"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </template>
          </AdminListaOrdenavel>

        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-default px-4 py-3 sm:px-6">
        <p class="text-xs text-muted">
          {{ origem[aba] === 'cms' ? 'Este bloco usa o conteúdo salvo aqui.' : 'Este bloco ainda usa o padrão do site.' }}
        </p>
        <div class="flex gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-rotate-ccw"
            :disabled="origem[aba] !== 'cms'"
            @click="restaurarPadrao(aba)"
          >
            Restaurar padrão
          </UButton>
          <UButton
            color="primary"
            icon="i-lucide-save"
            :loading="salvando === aba"
            @click="salvar(aba)"
          >
            Salvar {{ abaAtual.label.toLowerCase() }}
          </UButton>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
