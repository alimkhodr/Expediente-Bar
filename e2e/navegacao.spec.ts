import { test, expect } from '@playwright/test'

test.describe('Navegação', () => {
  test('home carrega com hero, links principais e seções', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Expediente Bar/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const nav = page.getByRole('navigation', { name: 'Links principais' })
    await expect(nav).toBeVisible()
    for (const nome of ['Reservar', 'Cardápio', 'Eventos', 'Agenda', 'Instagram', 'iFood', 'Como chegar']) {
      await expect(nav.getByRole('link', { name: new RegExp(nome, 'i') }).first()).toBeVisible()
    }

    // eventos e avaliações só aparecem quando há dados (Sympla / Google)
    for (const id of ['destaques', 'agenda', 'galeria', 'reservas', 'faq', 'local']) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1)
    }
  })

  test('header fixo aparece ao rolar e leva para as seções', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toHaveAttribute('aria-hidden', 'true')

    await page.mouse.wheel(0, 900)
    await expect(header).not.toHaveAttribute('aria-hidden', 'true')
    await expect(header.getByRole('link', { name: /reservar/i })).toBeVisible()
  })

  test('âncora #agenda rola até a seção', async ({ page }) => {
    await page.goto('/#agenda')
    const secao = page.locator('section#agenda')
    await expect(secao).toBeVisible()
    await expect.poll(async () => secao.evaluate(el => Math.abs(el.getBoundingClientRect().top) < 160), { timeout: 15_000 }).toBeTruthy()
  })

  test('página do cardápio exibe as páginas e a navegação', async ({ page }) => {
    await page.goto('/cardapio')
    await expect(page.getByRole('heading', { level: 1, name: /cardápio/i })).toBeVisible()
    await expect(page.locator('figure[data-pagina]')).toHaveCount(4)
    const grupo = page.getByRole('group', { name: 'Navegação do cardápio' })
    await expect(grupo).toContainText('Página 1 / 4')
    await grupo.getByRole('button', { name: 'Próxima página' }).click()
    await expect(grupo).toContainText('Página 2 / 4', { timeout: 8000 })
  })

  test('cardápio abre o zoom (lightbox) ao tocar em uma página', async ({ page }) => {
    await page.goto('/cardapio')
    await page.locator('figure[data-pagina="1"] a').click()
    await expect(page.locator('.pswp.pswp--open')).toBeVisible()
    await page.waitForTimeout(600)
    await page.locator('.pswp__button--close').click({ force: true })
    await expect(page.locator('.pswp')).toHaveCount(0)
  })

  test('página de eventos responde com título e estado (lista ou vazio)', async ({ page }) => {
    await page.goto('/eventos')
    await expect(page.getByRole('heading', { level: 1, name: /eventos/i })).toBeVisible()
    const cards = page.locator('article')
    const vazio = page.getByText('Nenhum evento com ingresso no momento.')
    await expect(cards.first().or(vazio)).toBeVisible()
  })

  test('404 mostra página de erro amigável', async ({ page }) => {
    const resposta = await page.goto('/nao-existe')
    expect(resposta?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: /página não encontrada/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /voltar para o início/i }).or(page.getByRole('link', { name: /voltar para o início/i }))).toBeVisible()
  })

  test('URLs antigas redirecionam', async ({ request }) => {
    for (const [de, para] of [['/painel', '/tv'], ['/painel/admin', '/admin']]) {
      const r = await request.get(de, { maxRedirects: 0 })
      expect(r.status(), de).toBe(301)
      expect(r.headers().location).toContain(para)
    }
  })
})
