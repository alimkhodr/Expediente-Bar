import type { ConteudoResponse } from '~/types/conteudo'
import { conteudoPadrao } from '~/utils/conteudo-padrao'

/** Conteúdo editável do site (CMS) com fallback para o padrão do código. Uma requisição por página (SSR). */
export function useConteudo () {
  const { data } = useFetch<ConteudoResponse>('/api/conteudo', {
    key: 'conteudo-site',
    default: () => ({
      conteudo: conteudoPadrao,
      origem: { links: 'padrao', destaques: 'padrao', agenda: 'padrao', faq: 'padrao' },
      atualizadoEm: ''
    }),
    dedupe: 'defer'
  })

  const conteudo = computed(() => data.value?.conteudo ?? conteudoPadrao)

  return {
    conteudo,
    links: computed(() => conteudo.value.links.filter(l => l.ativo)),
    destaques: computed(() => conteudo.value.destaques.filter(d => d.ativo)),
    agenda: computed(() => conteudo.value.agenda),
    faq: computed(() => conteudo.value.faq)
  }
}
