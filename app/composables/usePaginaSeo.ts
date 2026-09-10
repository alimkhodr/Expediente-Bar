interface OpcoesSeo {
  titulo: string
  descricao: string
  /** Caminho canônico, ex.: '/cardapio' */
  caminho: string
  imagem?: string
  /** Quando true, não aplica o sufixo "· Expediente Bar" (usado na home). */
  tituloCompleto?: boolean
  tipo?: 'website' | 'article'
}

/** Meta tags únicas por página: title, description, canonical, Open Graph e Twitter Cards. */
export function usePaginaSeo (opcoes: OpcoesSeo) {
  const { public: { siteUrl } } = useRuntimeConfig()
  const url = `${siteUrl}${opcoes.caminho === '/' ? '/' : opcoes.caminho}`
  const imagem = opcoes.imagem?.startsWith('http') ? opcoes.imagem : `${siteUrl}${opcoes.imagem ?? site.images.og}`

  if (opcoes.tituloCompleto) {
    useHead({ titleTemplate: '%s' })
  }

  useSeoMeta({
    title: opcoes.titulo,
    description: opcoes.descricao,
    robots: 'index, follow, max-image-preview:large',
    ogType: opcoes.tipo ?? 'website',
    ogLocale: 'pt_BR',
    ogSiteName: site.name,
    ogTitle: opcoes.titulo,
    ogDescription: opcoes.descricao,
    ogUrl: url,
    ogImage: imagem,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: `Logo do ${site.name}`,
    twitterCard: 'summary_large_image',
    twitterTitle: opcoes.titulo,
    twitterDescription: opcoes.descricao,
    twitterImage: imagem
  })

  useHead({
    link: [{ rel: 'canonical', href: url }]
  })
}
