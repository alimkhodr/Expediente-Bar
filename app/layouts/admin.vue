<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// Layout da área interna: menu lateral no desktop (recolhível) e gaveta no celular.
const user = useSupabaseUser()
const { sair } = useSessaoAdmin()
const open = ref(false)
const waiter = computed(() => isWaiter(user.value))

const ferramentas = computed<NavigationMenuItem[]>(() => adminTools.filter(tool => canAccess(tool.to, waiter.value)).map(tool => ({
  label: tool.label,
  icon: tool.icon,
  to: tool.to,
  exact: tool.to === '/admin',
  onSelect: () => { open.value = false }
})))

// Garçom vê só a TV (para conferir a chamada)
const telasPublicas = computed<NavigationMenuItem[]>(() => publicScreens.filter(screen => !waiter.value || screen.to === '/tv').map(screen => ({
  label: screen.label,
  icon: screen.icon,
  to: screen.to,
  target: '_blank',
  trailingIcon: 'i-lucide-arrow-up-right'
})))
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      v-model:open="open"
      collapsible
      :default-size="16"
      :ui="{ footer: 'border-t border-default' }"
    >
      <template #header="{ collapsed }">
        <NuxtLink
          :to="waiter ? WAITER_HOME : '/admin'"
          class="flex items-center gap-2"
          aria-label="Início do admin"
        >
          <img
            v-if="!collapsed"
            src="/logo.svg"
            alt="Expediente Bar"
            width="476"
            height="151"
            class="h-7 w-auto"
          />
          <UIcon
            v-else
            name="i-lucide-beer"
            class="mx-auto size-5 text-primary"
          />
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="ferramentas"
          orientation="vertical"
          tooltip
        />

        <p
          v-if="!collapsed"
          class="mt-4 px-2.5 text-xs font-medium text-dimmed"
        >
          Telas públicas
        </p>
        <UNavigationMenu
          :collapsed="collapsed"
          :items="telasPublicas"
          orientation="vertical"
          tooltip
        />
      </template>

      <template #footer="{ collapsed }">
        <div class="flex w-full items-center gap-2">
          <UAvatar
            :alt="user?.email ?? 'Equipe'"
            icon="i-lucide-user"
            size="sm"
          />
          <span
            v-if="!collapsed"
            class="min-w-0 flex-1 truncate text-sm text-muted"
          >
            {{ user?.email }}
          </span>
          <UTooltip text="Sair">
            <UButton
              icon="i-lucide-log-out"
              color="neutral"
              variant="ghost"
              aria-label="Sair"
              @click="sair"
            />
          </UTooltip>
        </div>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
