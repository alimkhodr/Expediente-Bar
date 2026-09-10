import { test, expect } from '@playwright/test'

test.describe('Mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'só no projeto mobile')

  test('não há rolagem horizontal na home e no cardápio', async ({ page }) => {
    for (const rota of ['/', '/cardapio', '/eventos']) {
      await page.goto(rota)
      await page.waitForLoadState('networkidle')
      const larguras = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        vp: window.innerWidth
      }))
      expect(larguras.doc, rota).toBeLessThanOrEqual(larguras.vp + 1)
    }
  })

  test('menu do header abre no celular e lista os links', async ({ page }) => {
    await page.goto('/cardapio')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    const menu = page.getByRole('navigation', { name: 'Menu móvel' })
    await expect(menu).toBeVisible()
    await expect(menu.getByRole('link', { name: 'Agenda' })).toBeVisible()
    await expect(menu.getByRole('link', { name: 'WhatsApp' })).toBeVisible()
  })

  test('links do hero têm área de toque confortável', async ({ page }) => {
    await page.goto('/')
    const links = page.getByRole('navigation', { name: 'Links principais' }).getByRole('link')
    const total = await links.count()
    expect(total).toBeGreaterThanOrEqual(5)
    for (let i = 0; i < total; i++) {
      const caixa = await links.nth(i).boundingBox()
      expect(caixa?.height ?? 0).toBeGreaterThanOrEqual(44)
    }
  })
})
