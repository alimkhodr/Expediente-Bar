/**
 * Capturas de tela de página inteira para revisão visual (desktop e mobile).
 *   BASE_URL=http://localhost:3333 node scripts/capturas.mjs
 * Saída em ./capturas (ignorado pelo git). Requer `playwright install chromium`.
 */
import { chromium, devices } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const base = process.env.BASE_URL || 'http://localhost:3333'
mkdirSync('capturas', { recursive: true })
const browser = await chromium.launch()

async function capturar (nome, url, ctxOpts, fullPage = true) {
  const ctx = await browser.newContext({ ...ctxOpts, colorScheme: 'dark', reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(base + url, { waitUntil: 'networkidle' })
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1500)
  const overflow = await page.evaluate(() => {
    const clipado = (el) => {
      for (let a = el.parentElement; a; a = a.parentElement) {
        const o = getComputedStyle(a).overflowX
        if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') return true
      }
      return false
    }
    const largos = [...document.querySelectorAll('body *')]
      .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1 && !clipado(el))
      .slice(0, 8)
      .map(el => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} → ${Math.round(el.getBoundingClientRect().right)}px`)
    const secoes = [...document.querySelectorAll('section[id], footer, header')].map(s => `${s.id || s.tagName.toLowerCase()}:${Math.round(s.offsetHeight)}`)
    return { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, largos, secoes: secoes.join(' ') }
  })
  await page.screenshot({ path: `capturas/${nome}.png`, fullPage })
  console.log(`${nome}: ${await page.title()} | scrollWidth ${overflow.scrollWidth}/${overflow.innerWidth}`)
  console.log('   seções:', overflow.secoes)
  overflow.largos.forEach(l => console.log('   overflow:', l))
  await ctx.close()
}

await capturar('home-desktop', '/', { viewport: { width: 1280, height: 800 } })

// Capturas por seção (desktop) para revisão de detalhe
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark', reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)) } })
  await page.waitForTimeout(2000)
  for (const id of ['destaques', 'eventos', 'agenda', 'galeria', 'reservas', 'avaliacoes', 'faq', 'local']) {
    const el = page.locator(`#${id}`)
    if (await el.count()) await el.screenshot({ path: `capturas/secao-${id}.png` })
  }
  await ctx.close()
}
await capturar('hero-desktop', '/', { viewport: { width: 1280, height: 800 } }, false)
await capturar('hero-mobile', '/', { ...devices['Pixel 7'] }, false)
await capturar('home-mobile', '/', { ...devices['Pixel 7'] })
await capturar('cardapio-mobile', '/cardapio', { ...devices['Pixel 7'] }, false)
await capturar('eventos-desktop', '/eventos', { viewport: { width: 1280, height: 800 } })
await browser.close()
