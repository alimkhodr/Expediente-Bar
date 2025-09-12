import clarity from '@microsoft/clarity'

export default defineNuxtPlugin(() => {
  if (import.meta.client && process.env.NODE_ENV === 'production') {
    nextTick(() => {
      clarity.init('t8ownucnt6')
    })
  }
})
