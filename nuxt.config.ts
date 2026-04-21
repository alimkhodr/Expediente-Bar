// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxt/fonts', '@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  supabase: {
    redirectOptions: {
      login: 'false',
      callback: 'false',
      exclude: ['*']
    }
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },
  runtimeConfig: {
    apiKey: process.env.NUXT_API_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'pt-BR'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }
      ]
    }
  },
  image: {
    quality: 80,
    format: ['webp'],
    domains: ['akrnjowlqqfiqvfgsojs.supabase.co']
  },
  routeRules: {
    '/api/places/**': { cache: { maxAge: 60 * 60 } }
  },
  nitro: {
    preset: 'netlify',
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },
  ssr: true,
  vite: {
    ssr: {
      external: ['reka-ui', 'vaul-vue']
    }
  }
})
