import { test, expect } from '@playwright/test'

const paginas = [
  { rota: '/', titulo: /Expediente Bar/, canonical: /\/$/ },
  { rota: '/cardapio', titulo: /Cardápio · Expediente Bar/, canonical: /\/cardapio$/ },
  { rota: '/eventos', titulo: /Eventos e ingressos · Expediente Bar/, canonical: /\/eventos$/ }
]

test.describe('SEO básico', () => {
  test.skip(({ isMobile }) => isMobile, 'meta tags não dependem do viewport')

  for (const pagina of paginas) {
    test(`meta tags únicas em ${pagina.rota}`, async ({ page }) => {
      await page.goto(pagina.rota)
      await expect(page).toHaveTitle(pagina.titulo)

      const descricao = await page.locator('meta[name="description"]').getAttribute('content')
      expect(descricao?.length ?? 0).toBeGreaterThan(50)
      expect(descricao?.length ?? 0).toBeLessThanOrEqual(320)

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).toMatch(pagina.canonical)

      for (const prop of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:locale']) {
        await expect(page.locator(`meta[property="${prop}"]`), prop).toHaveCount(1)
      }
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
      await expect(page.locator('h1')).toHaveCount(1)
    })
  }

  test('títulos e descrições são diferentes entre páginas', async ({ page }) => {
    const titulos = new Set<string>()
    const descricoes = new Set<string>()
    for (const p of paginas) {
      await page.goto(p.rota)
      titulos.add(await page.title())
      descricoes.add((await page.locator('meta[name="description"]').getAttribute('content')) ?? '')
    }
    expect(titulos.size).toBe(paginas.length)
    expect(descricoes.size).toBe(paginas.length)
  })

  test('JSON-LD da home traz o negócio local com endereço, telefone e horários', async ({ page }) => {
    await page.goto('/')
    const blocos = await page.locator('script[type="application/ld+json"]').allTextContents()
    const nodos = blocos.flatMap(b => {
      const json = JSON.parse(b)
      return json['@graph'] ?? [json]
    })
    const negocio = nodos.find((n: { '@type': string | string[] }) => [n['@type']].flat().includes('BarOrPub'))
    expect(negocio).toBeTruthy()
    expect(negocio.telephone).toBeTruthy()
    expect(negocio.address?.streetAddress).toBeTruthy()
    expect(negocio.openingHoursSpecification?.length).toBeGreaterThan(0)
    expect(negocio.sameAs).toContain('https://www.instagram.com/expedientebar_')
    expect(nodos.some((n: { '@type': string }) => n['@type'] === 'FAQPage')).toBeTruthy()
    expect(nodos.some((n: { '@type': string }) => n['@type'] === 'WebSite')).toBeTruthy()
  })

  test('JSON-LD do cardápio inclui Menu e BreadcrumbList', async ({ page }) => {
    await page.goto('/cardapio')
    const blocos = await page.locator('script[type="application/ld+json"]').allTextContents()
    const tipos = blocos.flatMap(b => (JSON.parse(b)['@graph'] ?? []).map((n: { '@type': string }) => n['@type']))
    expect(tipos).toContain('Menu')
    expect(tipos).toContain('BreadcrumbList')
  })

  test('robots.txt e sitemap.xml existem e bloqueiam a área interna', async ({ request }) => {
    const robots = await request.get('/robots.txt')
    expect(robots.ok()).toBeTruthy()
    const texto = await robots.text()
    expect(texto).toMatch(/Disallow: \/admin/)
    expect(texto).toMatch(/Disallow: \/tv/)
    expect(texto).toMatch(/Sitemap: .*sitemap\.xml/)

    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.ok()).toBeTruthy()
    const xml = await sitemap.text()
    expect(xml).toContain('/cardapio')
    expect(xml).toContain('/eventos')
    expect(xml).not.toContain('/admin')
    expect(xml).not.toContain('/tv')
  })

  test('páginas internas não são indexáveis', async ({ page }) => {
    await page.goto('/tv')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  })

  test('imagens têm alt e ícones decorativos estão ocultos', async ({ page }) => {
    await page.goto('/')
    const semAlt = await page.locator('img:not([alt])').count()
    expect(semAlt).toBe(0)
  })
})
