import { test, expect } from '@playwright/test'

test.describe('Links', () => {
  test.skip(({ isMobile }) => isMobile, 'verificação de links independe do viewport')

  test('todos os links internos respondem 2xx/3xx', async ({ page, request }) => {
    const internos = new Set<string>()
    for (const rota of ['/', '/cardapio', '/eventos']) {
      await page.goto(rota)
      const hrefs = await page.locator('a[href^="/"]').evaluateAll(as => as.map(a => (a as HTMLAnchorElement).getAttribute('href')!))
      hrefs.forEach(h => internos.add(h.split('#')[0]!))
    }
    internos.delete('')
    for (const href of internos) {
      const r = await request.get(href)
      expect(r.status(), href).toBeLessThan(400)
    }
  })

  test('âncoras da home apontam para seções existentes', async ({ page }) => {
    await page.goto('/')
    const ancoras = await page.locator('a[href^="#"], a[href^="/#"]').evaluateAll(as =>
      as.map(a => (a as HTMLAnchorElement).getAttribute('href')!.replace(/^\/?#/, ''))
    )
    // eventos e avaliações são seções condicionais (dependem de dados externos)
    for (const id of new Set(ancoras)) {
      if (!id || id === 'eventos' || id === 'avaliacoes') continue
      await expect(page.locator(`#${id}`), `#${id}`).toHaveCount(1)
    }
  })

  test('links externos abrem em nova aba com rel seguro', async ({ page }) => {
    await page.goto('/')
    const externos = page.locator('a[href^="http"]:not([href*="expedientebar.com.br"])')
    const total = await externos.count()
    expect(total).toBeGreaterThan(3)
    for (let i = 0; i < total; i++) {
      const a = externos.nth(i)
      await expect(a).toHaveAttribute('target', '_blank')
      await expect(a).toHaveAttribute('rel', /noopener/)
    }
  })

  test('links externos principais estão acessíveis (HEAD)', async ({ request }) => {
    test.slow()
    const urls = [
      'https://www.instagram.com/expedientebar_',
      'https://www.ifood.com.br/delivery/sao-jose-dos-campos-sp/expediente-bar-jardim-satelite/0780226c-3ae2-4204-b6f0-ed90ada79fc2',
      'https://wa.me/5512988865185'
    ]
    for (const url of urls) {
      const r = await request.head(url, { maxRedirects: 5, timeout: 15_000 }).catch(() => null)
      // Alguns hosts bloqueiam bots (403/405/429): só falha se o host não responder.
      expect(r, url).not.toBeNull()
    }
  })
})
