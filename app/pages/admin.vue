<script setup lang="ts">
import type { Aviso, AvisoAction } from '~/types/aviso'

definePageMeta({
  layout: 'blank',
  middleware: ['auth']
})

const STORAGE_URL = 'https://akrnjowlqqfiqvfgsojs.supabase.co/storage/v1/object/public/avisos'

const supabase = useSupabaseClient()
const toast = useToast()

const avisos = ref<(Aviso & { id: number })[]>([])
const loadingAvisos = ref(false)
const showModal = ref(false)
const savingAviso = ref(false)
const uploadingImage = ref(false)
const editingId = ref<number | null>(null)

const DAYS_OPTIONS = [
  { value: 'monday', label: 'Segunda' },
  { value: 'tuesday', label: 'Terça' },
  { value: 'wednesday', label: 'Quarta' },
  { value: 'thursday', label: 'Quinta' },
  { value: 'friday', label: 'Sexta' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' },
  { value: 'all', label: 'Todos os dias' }
]

const WHATSAPP_BASE = 'https://wa.me/5512988865185'

const emptyForm = () => ({
  title: '',
  description: '',
  avatar_src: '',
  days: [] as string[],
  status: false,
  action_label: '',
  action_is_whatsapp: true,
  whatsapp_message: '',
  action_link: ''
})

const form = ref(emptyForm())
const imageFile = ref<File | null>(null)

const isEditing = computed(() => editingId.value !== null)
const modalTitle = computed(() => isEditing.value ? 'Editar Aviso' : 'Novo Aviso')

watch(imageFile, async (file) => {
  if (!file) return
  uploadingImage.value = true
  const fileName = `${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('avisos').upload(fileName, file)
  if (error) {
    toast.add({ title: 'Erro ao fazer upload da imagem', description: error.message, color: 'error' })
  } else {
    form.value.avatar_src = `${STORAGE_URL}/${fileName}`
  }
  uploadingImage.value = false
})

async function loadAvisos () {
  loadingAvisos.value = true
  const { data, error } = await supabase.from('avisos').select('*').order('id')
  if (error) {
    toast.add({ title: 'Erro ao carregar avisos', description: error.message, color: 'error' })
  } else {
    avisos.value = data ?? []
  }
  loadingAvisos.value = false
}

async function toggleStatus (aviso: Aviso & { id: number }) {
  // @ts-expect-error - Supabase schema may not be defined
  const { error } = await supabase.from('avisos').update({ status: !aviso.status }).eq('id', aviso.id)
  if (error) {
    toast.add({ title: 'Erro ao atualizar status', description: error.message, color: 'error' })
  } else {
    aviso.status = !aviso.status
  }
}

async function deleteAviso (id: number) {
  const { error } = await supabase.from('avisos').delete().eq('id', id)
  if (error) {
    toast.add({ title: 'Erro ao deletar aviso', description: error.message, color: 'error' })
  } else {
    avisos.value = avisos.value.filter(a => a.id !== id)
    toast.add({ title: 'Aviso deletado', color: 'success' })
  }
}

function openCreate () {
  editingId.value = null
  form.value = emptyForm()
  imageFile.value = null
  showModal.value = true
}

function openEdit (aviso: Aviso & { id: number }) {
  editingId.value = aviso.id
  const existingLink = aviso.actions?.[0]?.link ?? ''
  const isWhatsapp = existingLink.startsWith(WHATSAPP_BASE)

  form.value = {
    title: aviso.title,
    description: aviso.description,
    avatar_src: aviso.avatar?.src ?? '',
    days: [...aviso.days],
    status: aviso.status,
    action_label: aviso.actions?.[0]?.label ?? '',
    action_is_whatsapp: isWhatsapp,
    whatsapp_message: isWhatsapp
      ? decodeURIComponent(existingLink.replace(`${WHATSAPP_BASE}?text=`, ''))
      : '',
    action_link: isWhatsapp ? '' : existingLink
  }
  imageFile.value = null
  showModal.value = true
}

function buildPayload () {
  const link = form.value.action_is_whatsapp
    ? `${WHATSAPP_BASE}?text=${encodeURIComponent(form.value.whatsapp_message)}`
    : form.value.action_link

  const actions: AvisoAction[] = form.value.action_label && link
    ? [{
      trailingIcon: 'material-symbols-arrow-right-alt',
      label: form.value.action_label,
      link
    }]
    : []

  return {
    title: form.value.title,
    description: form.value.description,
    avatar: { src: form.value.avatar_src, alt: form.value.title },
    days: form.value.days,
    status: form.value.status,
    actions
  }
}

async function saveAviso () {
  if (!form.value.title || !form.value.description || form.value.days.length === 0) {
    toast.add({ title: 'Preencha título, descrição e ao menos um dia', color: 'warning' })
    return
  }

  savingAviso.value = true
  const payload = buildPayload()

  if (isEditing.value) {
    // @ts-expect-error - Supabase schema may not be defined
    const { error } = await supabase.from('avisos').update(payload).eq('id', editingId.value)
    if (error) {
      toast.add({ title: 'Erro ao atualizar aviso', description: error.message, color: 'error' })
    } else {
      toast.add({ title: 'Aviso atualizado', color: 'success' })
      showModal.value = false
      await loadAvisos()
    }
  } else {
    // @ts-expect-error - Supabase schema may not be defined
    const { error } = await supabase.from('avisos').insert([payload])
    if (error) {
      toast.add({ title: 'Erro ao salvar aviso', description: error.message, color: 'error' })
    } else {
      toast.add({ title: 'Aviso criado com sucesso', color: 'success' })
      showModal.value = false
      await loadAvisos()
    }
  }

  savingAviso.value = false
}

function dayLabel (day: string) {
  return DAYS_OPTIONS.find(d => d.value === day)?.label ?? day
}

async function logout () {
  await supabase.auth.signOut()
  toast.add({ title: 'Logout realizado', color: 'info' })
  navigateTo('/login')
}

onMounted(() => {
  loadAvisos()
})
</script>

<template>
  <UContainer class="flex flex-col items-center py-6 px-4 gap-6 min-h-screen">
    <div class="w-full max-w-2xl flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        Admin
      </h1>
      <UButton
        icon="i-heroicons-arrow-right-on-rectangle"
        color="neutral"
        variant="link"
        label="Sair"
        @click="logout"
      />
    </div>

    <UPageCard class="w-full max-w-2xl">
      <div class="flex items-center justify-between mb-6 gap-4">
        <div>
          <h2 class="text-xl font-semibold">
            Avisos
          </h2>
          <p class="text-sm text-muted mt-1">
            Gerencie os avisos exibidos no site
          </p>
        </div>
        <UButton
          icon="i-heroicons-plus"
          label="Novo Aviso"
          @click="openCreate"
        />
      </div>

      <div
        v-if="loadingAvisos"
        class="flex justify-center py-8"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="animate-spin text-2xl text-muted"
        />
      </div>

      <div
        v-else-if="avisos.length === 0"
        class="text-center py-8 text-muted"
      >
        Nenhum aviso cadastrado
      </div>

      <div
        v-else
        class="flex flex-col gap-3"
      >
        <div
          v-for="aviso in avisos"
          :key="aviso.id"
          class="flex flex-col gap-3 p-4 border border-default rounded-lg"
        >
          <div class="flex items-start gap-3 min-w-0">
            <img
              v-if="aviso.avatar?.src"
              :src="aviso.avatar.src"
              :alt="aviso.avatar.alt"
              class="w-10 h-10 rounded-lg object-cover shrink-0 mt-0.5"
            />
            <div class="flex-1 min-w-0">
              <p class="font-medium line-clamp-1 text-ellipsis">
                {{ aviso.title }}
              </p>
              <p class="text-sm text-muted truncate">
                {{ aviso.description }}
              </p>
              <div class="flex flex-wrap gap-1 mt-1">
                <UBadge
                  v-for="day in aviso.days"
                  :key="day"
                  variant="soft"
                  color="neutral"
                  size="xs"
                >
                  {{ dayLabel(day) }}
                </UBadge>
              </div>
            </div>
          </div>
          <!-- Linha inferior: ações -->
          <div class="flex items-center justify-between border-t border-default pt-3">
            <USwitch
              :model-value="aviso.status"
              :label="aviso.status ? 'Ativo' : 'Inativo'"
              @update:model-value="toggleStatus(aviso)"
            />
            <div class="flex items-center gap-1">
              <UButton
                icon="i-heroicons-pencil-square"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="openEdit(aviso)"
              />
              <UButton
                icon="i-heroicons-trash"
                color="error"
                variant="ghost"
                size="sm"
                @click="deleteAviso(aviso.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </UPageCard>

    <UModal
      v-model:open="showModal"
      :title="modalTitle"
    >
      <template #body>
        <UForm
          :state="form"
          class="space-y-4"
          @submit="saveAviso"
        >
          <UFormField
            label="Título"
            name="title"
            required
          >
            <UInput
              v-model="form.title"
              placeholder="Ex: Sexta | Caipirinha 50% OFF"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Descrição"
            name="description"
            required
          >
            <UInput
              v-model="form.description"
              placeholder="Ex: Das 17h às 20h"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Imagem">
            <div class="flex flex-col gap-3">
              <UFileUpload
                v-model="imageFile"
                accept="image/*"
                label="Clique ou arraste uma imagem"
                :loading="uploadingImage"
              />
              <img
                v-if="form.avatar_src"
                :src="form.avatar_src"
                class="w-16 h-16 rounded-lg object-cover"
              />
            </div>
          </UFormField>

          <UFormField
            label="Dias"
            name="days"
            required
          >
            <UCheckboxGroup
              v-model="form.days"
              :items="DAYS_OPTIONS"
              orientation="vertical"
            />
          </UFormField>

          <UFormField label="Botão (label)">
            <UInput
              v-model="form.action_label"
              placeholder="Ex: Reservar, Ver mais..."
              class="w-full"
            />
          </UFormField>

          <USwitch
            v-model="form.action_is_whatsapp"
            label="Link do WhatsApp"
          />

          <UFormField
            v-if="form.action_is_whatsapp"
            label="Mensagem do WhatsApp"
          >
            <UInput
              v-model="form.whatsapp_message"
              placeholder="Ex: Olá! Gostaria de reservar uma mesa!"
              class="w-full"
            />
          </UFormField>

          <UFormField
            v-else
            label="Link"
          >
            <UInput
              v-model="form.action_link"
              placeholder="https://..."
              class="w-full"
            />
          </UFormField>

          <USwitch
            v-model="form.status"
            label="Ativo"
          />

          <div class="flex justify-end gap-2 pt-2">
            <UButton
              color="neutral"
              variant="ghost"
              label="Cancelar"
              @click="showModal = false"
            />
            <UButton
              type="submit"
              :label="isEditing ? 'Atualizar' : 'Salvar'"
              :loading="savingAviso"
            />
          </div>
        </UForm>
      </template>
    </UModal>
  </UContainer>
</template>
