import type { ChaveConteudo, Conteudo, ConteudoResponse } from '~/types/conteudo'
import { conteudoPadrao } from '~/utils/conteudo-padrao'

interface Linha { chave: string; valor: unknown; atualizado_em: string }

const CHAVES: ChaveConteudo[] = ['links', 'destaques', 'agenda', 'faq']

/**
 * Conteúdo editável do site (CMS em /admin/cms), lido da tabela `conteudo` do Supabase
 * via REST com a chave anônima (a tabela tem leitura pública por RLS).
 * Chaves ausentes caem no conteúdo padrão do código.
 */
export default cachedEventHandler(async (event): Promise<ConteudoResponse> => {
  const { public: { supabaseUrl, supabaseKey } } = useRuntimeConfig(event)
  const conteudo: Conteudo = structuredClone(conteudoPadrao)
  const origem = Object.fromEntries(CHAVES.map(c => [c, 'padrao'])) as ConteudoResponse['origem']
  let atualizadoEm = new Date(0).toISOString()

  if (supabaseUrl && supabaseKey) {
    try {
      const linhas = await $fetch<Linha[]>(`${supabaseUrl}/rest/v1/conteudo`, {
        query: { select: 'chave,valor,atualizado_em' },
        // Só `apikey`: funciona tanto com a chave anon legada quanto com a publishable (sb_publishable_…)
        headers: { apikey: supabaseKey },
        timeout: 6000
      })
      for (const linha of linhas) {
        const chave = linha.chave as ChaveConteudo
        if (!CHAVES.includes(chave) || linha.valor == null) continue
        ;(conteudo as Record<string, unknown>)[chave] = linha.valor
        origem[chave] = 'cms'
        if (linha.atualizado_em > atualizadoEm) atualizadoEm = linha.atualizado_em
      }
    } catch (erro) {
      console.error('[conteudo] falha ao ler o CMS, usando padrão:', (erro as Error).message)
    }
  }

  return { conteudo, origem, atualizadoEm }
}, {
  // Em dev não cacheia, para refletir edições no conteúdo padrão imediatamente
  maxAge: import.meta.dev ? 1 : 60,
  swr: true,
  name: 'conteudo-site',
  getKey: () => 'v2'
})
