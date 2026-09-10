/**
 * Roda o Lighthouse (mobile) nas páginas públicas e falha se alguma nota ficar abaixo do mínimo.
 *   BASE_URL=http://localhost:3100 node scripts/lighthouse.mjs
 * Requer Chrome instalado. Usa `npx lighthouse` (sem dependência fixa no projeto).
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'

const base = process.env.BASE_URL || 'http://localhost:3100'
const minimo = Number(process.env.LH_MIN || 90)
const rotas = (process.env.LH_ROTAS || '/,/cardapio,/eventos').split(',')
const categorias = ['performance', 'accessibility', 'best-practices', 'seo']

mkdirSync('.lighthouse', { recursive: true })
let falhou = false

for (const rota of rotas) {
  const saida = `.lighthouse/${rota.replace(/\//g, '_') || '_home'}.json`
  execFileSync('npx', [
    '-y', 'lighthouse', `${base}${rota}`,
    '--quiet', '--output=json', `--output-path=${saida}`,
    '--only-categories=' + categorias.join(','),
    '--form-factor=mobile', '--screenEmulation.mobile',
    '--chrome-flags=--headless=new --no-sandbox'
  ], { stdio: 'inherit' })
  const relatorio = JSON.parse(readFileSync(saida, 'utf8'))
  const notas = Object.fromEntries(categorias.map(c => [c, Math.round((relatorio.categories[c]?.score ?? 0) * 100)]))
  const ok = Object.values(notas).every(n => n >= minimo)
  if (!ok) falhou = true
  console.log(`${ok ? '✔' : '✖'} ${rota.padEnd(10)} ` + categorias.map(c => `${c}: ${notas[c]}`).join(' · '))
}

process.exit(falhou ? 1 : 0)
