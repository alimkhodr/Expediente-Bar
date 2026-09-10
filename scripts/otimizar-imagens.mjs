/**
 * Pipeline de imagens do site.
 *
 *  pnpm imagens:galeria <pasta>  → converte as fotos da pasta para WebP em public/images/galeria
 *  pnpm imagens:marcas           → reduz os logos de public/images/brands (3800x1800 PNG → 600px WebP)
 *  pnpm imagens:cardapio         → converte public/images/cardapio/*.png para WebP
 *  pnpm imagens:favicons         → gera favicons quadrados (fundo preto) + apple-touch-icon + og-image
 *
 * Só depende de `sharp` (já usado pelo @nuxt/image).
 */
import { readdir, mkdir, writeFile, readFile, stat } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import sharp from 'sharp'

const raiz = resolve(import.meta.dirname, '..')
const publico = join(raiz, 'public')
const [, , comando, ...args] = process.argv

const kb = (n) => `${(n / 1024).toFixed(0)}KB`

async function galeria (origem) {
  if (!origem) throw new Error('Informe a pasta de origem das fotos')
  const destino = join(publico, 'images', 'galeria')
  await mkdir(destino, { recursive: true })
  const arquivos = (await readdir(origem))
    .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))

  const manifesto = []
  let indice = 0
  for (const arquivo of arquivos) {
    const caminho = join(origem, arquivo)
    const img = sharp(caminho, { failOn: 'none' }).rotate()
    const meta = await img.metadata()
    // fotos pequenas (< 600px) não entram na galeria: viram destaque à parte
    const pequena = Math.min(meta.width ?? 0, meta.height ?? 0) < 600
    indice += 1
    const nome = pequena ? `detalhe-${indice}` : `foto-${String(indice).padStart(2, '0')}`
    const saida = join(destino, `${nome}.webp`)
    const largura = pequena ? meta.width : Math.min(meta.width ?? 1080, 1080)
    await img.resize({ width: largura, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(saida)
    const s = await stat(saida)
    const m = await sharp(saida).metadata()
    manifesto.push({ src: `/images/galeria/${nome}.webp`, width: m.width, height: m.height, origem: arquivo })
    console.log(`${arquivo.padEnd(48)} → ${nome}.webp ${m.width}x${m.height} ${kb(s.size)}`)
  }
  await writeFile(join(raiz, 'app', 'assets', 'data', 'galeria.json'), JSON.stringify(manifesto, null, 2) + '\n')
  console.log(`\n${manifesto.length} imagens. Manifesto em app/assets/data/galeria.json`)
}

async function marcas () {
  const pasta = join(publico, 'images', 'brands')
  for (const arquivo of (await readdir(pasta)).filter(f => f.endsWith('.png'))) {
    const saida = join(pasta, `${basename(arquivo, '.png')}.webp`)
    await sharp(join(pasta, arquivo)).resize({ width: 600 }).webp({ quality: 85 }).toFile(saida)
    console.log(`${arquivo} → ${basename(saida)} ${kb((await stat(saida)).size)}`)
  }
}

async function cardapio () {
  const pasta = join(publico, 'images', 'cardapio')
  for (const arquivo of (await readdir(pasta)).filter(f => f.endsWith('.png'))) {
    const saida = join(pasta, `${basename(arquivo, '.png')}.webp`)
    await sharp(join(pasta, arquivo)).webp({ quality: 84, effort: 5 }).toFile(saida)
    const m = await sharp(saida).metadata()
    console.log(`${arquivo} → ${basename(saida)} ${m.width}x${m.height} ${kb((await stat(saida)).size)}`)
  }
}

/** Monta um .ico contendo um PNG (formato aceito por todos os navegadores modernos). */
function pngParaIco (png, tamanho) {
  const cabecalho = Buffer.alloc(6)
  cabecalho.writeUInt16LE(0, 0) // reservado
  cabecalho.writeUInt16LE(1, 2) // tipo: ícone
  cabecalho.writeUInt16LE(1, 4) // quantidade de imagens
  const entrada = Buffer.alloc(16)
  entrada.writeUInt8(tamanho === 256 ? 0 : tamanho, 0)
  entrada.writeUInt8(tamanho === 256 ? 0 : tamanho, 1)
  entrada.writeUInt8(0, 2) // paleta
  entrada.writeUInt8(0, 3) // reservado
  entrada.writeUInt16LE(1, 4) // planos
  entrada.writeUInt16LE(32, 6) // bits por pixel
  entrada.writeUInt32LE(png.length, 8)
  entrada.writeUInt32LE(6 + 16, 12)
  return Buffer.concat([cabecalho, entrada, png])
}

async function favicons () {
  // Fonte: public/favicon.svg (arte oficial, já com fundo preto, ~quadrada)
  const fonte = await readFile(join(publico, 'favicon.svg'))
  const logo = await readFile(join(publico, 'logo.svg'))
  const preto = { r: 0, g: 0, b: 0, alpha: 1 }

  async function quadrado (tamanho) {
    const arte = await sharp(fonte, { density: 300 })
      .resize({ width: tamanho, height: tamanho, fit: 'contain', background: preto })
      .png()
      .toBuffer()
    return sharp({ create: { width: tamanho, height: tamanho, channels: 4, background: preto } })
      .composite([{ input: arte, gravity: 'centre' }])
      .png()
      .toBuffer()
  }

  const saidas = [
    ['favicon-32x32.png', 32],
    ['favicon-192x192.png', 192],
    ['favicon-512x512.png', 512],
    ['apple-touch-icon.png', 180]
  ]
  for (const [nome, tamanho] of saidas) {
    await writeFile(join(publico, nome), await quadrado(tamanho))
    console.log(`${nome} ${tamanho}x${tamanho}`)
  }
  await writeFile(join(publico, 'favicon.ico'), pngParaIco(await quadrado(48), 48))
  console.log('favicon.ico 48x48')

  // Open Graph 1200x630: logo completo centralizado em fundo preto
  const logoPng = await sharp(logo, { density: 400 }).resize({ width: 760 }).png().toBuffer()
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: preto } })
    .composite([{ input: logoPng, gravity: 'centre' }])
    .jpeg({ quality: 88 })
    .toFile(join(publico, 'og-image.jpg'))
  console.log('og-image.jpg 1200x630')
}

const comandos = { galeria, marcas, cardapio, favicons }
if (!comandos[comando]) {
  console.error(`Uso: node scripts/otimizar-imagens.mjs <${Object.keys(comandos).join('|')}> [args]`)
  process.exit(1)
}
await comandos[comando](...args)
