// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://expedientebar.com.br'

/** Rotas internas (painel de senhas, TV, admin): sem SSR, sem indexação, fora do sitemap. */
const rotasInternas = ['/admin', '/admin/**', '/tv', '/login']

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  css: ['~/assets/css/main.css'],

  site: {
    url: siteUrl,
    name: 'Expediente Bar',
    description:
      'Bar em São José dos Campos com pagode ao vivo, sertanejo, cerveja gelada, porções e drinks. Reserve sua mesa, veja a agenda, o cardápio e os próximos eventos.',
    defaultLocale: 'pt-BR',
    indexable: true
  },

  sitemap: {
    exclude: [...rotasInternas],
    defaults: { changefreq: 'weekly', priority: 0.7 },
    urls: [
      { loc: '/', priority: 1, changefreq: 'daily' },
      { loc: '/eventos', priority: 0.9, changefreq: 'daily' },
      { loc: '/cardapio', priority: 0.8, changefreq: 'weekly' }
    ]
  },

  robots: {
    disallow: [...rotasInternas],
    blockNonSeoBots: true
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'expediente-color-mode'
  },

  fonts: {
    families: [
      // Pré-carrega os pesos usados acima da dobra para evitar troca de fonte (CLS)
      { name: 'Poppins', provider: 'google', weights: [400, 500, 600, 700], styles: ['normal'], preload: true },
      { name: 'Poppins', provider: 'google', weights: [700], styles: ['italic'], preload: true }
    ],
    defaults: { subsets: ['latin', 'latin-ext'] },
    experimental: { processCSSVariables: true }
  },

  runtimeConfig: {
    // Só no servidor
    googlePlacesKey: process.env.NUXT_GOOGLE_PLACES_KEY || process.env.NUXT_API_KEY || '',
    symplaToken: '',
    public: {
      siteUrl,
      // Cliente Supabase é criado sob demanda só nas páginas internas (ver useSupabase.ts)
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
      posthogKey: ''
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      titleTemplate: '%s · Expediente Bar',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#000000' },
        { name: 'apple-mobile-web-app-title', content: 'Expediente' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/favicon-512x512.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },

  image: {
    // Produção (Netlify): Netlify Image CDN. Dev e build local (node-server): IPX.
    provider: process.env.NITRO_PRESET === 'node-server' || process.env.NODE_ENV === 'development' ? 'ipx' : 'netlify',
    quality: 78,
    format: ['webp'],
    domains: ['akrnjowlqqfiqvfgsojs.supabase.co', 'images.sympla.com.br']
  },

  routeRules: {
    // Home: SSR com cache na CDN (stale-while-revalidate de 5 min) para refletir o CMS sem redeploy
    '/': { swr: 300 },
    // Cardápio: conteúdo estático, pré-renderizado
    '/cardapio': { prerender: true },
    // Eventos vêm do Sympla: SSR com cache na CDN (1h)
    '/eventos': { swr: 3600 },
    '/api/eventos': { swr: 3600 },
    '/api/conteudo': { swr: 300 },
    '/api/places/**': { swr: 3600 },
    // Área interna (TV de senhas, admin, acompanhamento): SPA, nunca indexada
    '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/tv': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/login': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    // URLs antigas
    '/painel': { redirect: { to: '/tv', statusCode: 301 } },
    '/painel/admin': { redirect: { to: '/admin', statusCode: 301 } },
    '/painel/acompanhar': { redirect: { to: '/tv', statusCode: 301 } }
  },

  nitro: {
    preset: 'netlify',
    // Pré-comprime os assets estáticos (a Netlify comprime na borda; útil no preview local e em outros hosts)
    compressPublicAssets: { gzip: true, brotli: true },
    // Pré-comprime JS/CSS estáticos (útil no preview local node-server; o Netlify comprime na borda)
    compressPublicAssets: { brotli: true, gzip: true },
    prerender: {
      crawlLinks: false,
      routes: ['/cardapio'],
      ignore: ['/.netlify']
    }
  },

  // Em desenvolvimento nada fica em cache de rota (senão o HTML antigo persiste por minutos)
  $development: {
    routeRules: {
      '/': { swr: false },
      '/eventos': { swr: false },
      '/api/eventos': { swr: false },
      '/api/conteudo': { swr: false },
      '/api/places/**': { swr: false }
    }
  },

  features: {
    // Não repassa o console do navegador para o terminal (estoura o buffer do `netlify dev`)
    devLogs: false
  },

  eslint: {
    config: { stylistic: false }
  }
})
