<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set (_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

// estado para esconder o header
const hidden = ref(false)
let lastScroll = 0

onMounted(() => {
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY

    if (currentScroll > lastScroll && currentScroll > 50) {
      hidden.value = true // rolando pra baixo
    } else {
      hidden.value = false // rolando pra cima
    }

    lastScroll = currentScroll
  })
})
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full z-50 transition-transform duration-300"
    :class="hidden ? '-translate-y-full' : 'translate-y-0'"
  >
    <div class="w-full px-6 py-4 bg-stone-950/85 backdrop-blur-md flex flex-row justify-between">
      <div class="flex flex-row justify-between items-center w-full">
        <NuxtLink to="/">
          <NuxtImg
            format="webp"
            src="/logo.svg"
            alt="logo"
            width="100"
            height="30"
          />
        </NuxtLink>
        <UDrawer direction="right">
          <UButton
            icon="i-material-symbols-menu"
            size="xl"
            color="neutral"
            variant="link"
            class="flex md:hidden"
          />

          <template #content>
            <div class="flex flex-col items-center">
              <UNavigationMenu
                orientation="vertical"
                :items="routes"
                class="size-full my-4"
              />
              <NuxtImg
                format="webp"
                src="/icon.svg"
                alt="logo"
                width="25"
                height="100"
                class="grayscale opacity-5 my-5"
              />
            </div>
          </template>
        </UDrawer>
      </div>

      <ClientOnly v-if="!colorMode?.forced">
        <UNavigationMenu
          orientation="horizontal"
          :items="routes"
          class="hidden md:flex"
        />
        <UButton
          :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
          color="neutral"
          variant="link"
          @click="isDark = !isDark"
        />

        <template #fallback>
          <div class="size-8" />
        </template>
      </ClientOnly>
    </div>
  </div>
</template>
