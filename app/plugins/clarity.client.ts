import clarity from '@microsoft/clarity'
const config = useRuntimeConfig()

export default defineNuxtPlugin(() => {
  if (import.meta.client && process.env.NODE_ENV === 'production') {
    clarity.init(config.public.clarity as string)
  }
})
