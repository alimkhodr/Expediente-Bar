import clarity from '@microsoft/clarity'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (import.meta.client && process.env.NODE_ENV === 'production' && config.public.clarity) {
    nextTick(() => {
      clarity.init(config.public.clarity as string)
    })
  }
})
