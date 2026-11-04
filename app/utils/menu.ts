// Cardápio em texto (novembro/2026), espelho das imagens em /images/cardapio/2026-11.
// Serve para o Google ler pratos e preços (as imagens não são indexadas como texto) e para o JSON-LD Menu.
// Ao trocar o cardápio, atualizar esta lista junto com as imagens.

export interface MenuItem {
  name: string
  /** Preço em reais */
  price: number
  description?: string
}

export interface MenuSection {
  name: string
  description?: string
  items: MenuItem[]
}

export const menuUpdatedAt = '2026-11'

export const menuSections: MenuSection[] = [
  {
    name: 'Porções',
    items: [
      { name: 'Fritas simples', price: 35 },
      { name: 'Fritas com mussarela', price: 45 },
      { name: 'Fritas com cheddar e bacon', price: 49 },
      { name: 'Mandioca', price: 40 },
      { name: 'Torresmo', price: 49 },
      { name: 'Dadinho de tapioca', price: 44 },
      { name: 'Contra filé acebolado', price: 75 },
      { name: 'Contra filé com fritas', price: 68 },
      { name: 'Contra filé com mandioca', price: 68 },
      { name: 'Frango crocante', price: 59 },
      { name: 'Frango à passarinho', price: 49 },
      { name: 'Salame', price: 40 },
      { name: 'Tilápia', price: 72 },
      { name: 'Tilápia com fritas', price: 67 },
      { name: 'Costela de tambaqui', price: 65 }
    ]
  },
  {
    name: 'Lanches',
    items: [
      { name: 'Blend Bacon BBQ', price: 36, description: 'Pão brioche, blend 150 g, cheddar, bacon, cebola roxa e molho barbecue' },
      { name: 'Blend Salada', price: 34, description: 'Pão brioche, blend 150 g, queijo prato, alface, tomate, cebola roxa e maionese da casa' },
      { name: 'Blend Junior', price: 30, description: 'Pão brioche, blend 150 g, cheddar e maionese da casa' }
    ]
  },
  {
    name: 'Bolinhos',
    items: [
      { name: 'Bolinho caipira', price: 39 },
      { name: 'Bolinho de feijoada', price: 45 },
      { name: 'Bolinho de bacalhau', price: 42 },
      { name: 'Bolinho de costela', price: 48 }
    ]
  },
  {
    name: 'Sobremesas',
    items: [
      { name: 'Brownie com sorvete', price: 28, description: 'Brownie, sorvete e calda de chocolate' },
      { name: 'Milk shake', price: 25, description: 'Creme, chocolate ou morango' }
    ]
  },
  {
    name: 'Sucos',
    items: [
      { name: 'Suco de morango', price: 14 },
      { name: 'Suco de maracujá', price: 14 },
      { name: 'Suco de abacaxi', price: 14 },
      { name: 'Suco de abacaxi com hortelã', price: 15 },
      { name: 'Suco de laranja', price: 15 },
      { name: 'Limonada suíça', price: 18 },
      { name: 'Laramora (suco especial)', price: 22 }
    ]
  },
  {
    name: 'Bebidas',
    items: [
      { name: 'Água', price: 6 },
      { name: 'Água com gás', price: 6 },
      { name: 'Refrigerante 350 ml', price: 8 },
      { name: 'H2O', price: 10 },
      { name: 'Tônica', price: 10 },
      { name: 'Red Bull tradicional', price: 18 },
      { name: 'Red Bull Editions', price: 18 }
    ]
  },
  {
    name: 'Caipirinhas',
    description: 'Vodka, cachaça ou saquê',
    items: [
      { name: 'Caipirinha de limão', price: 26 },
      { name: 'Caipirinha de morango', price: 26 },
      { name: 'Caipirinha de maracujá', price: 26 },
      { name: 'Caipirinha de frutas vermelhas', price: 28 },
      { name: 'Caipirinha de kiwi', price: 30 },
      { name: 'Caipirinha de três limões com rapadura', price: 30 },
      { name: 'Caipirinha de tangerina', price: 30 }
    ]
  },
  {
    name: "Gin Gordon's",
    items: [
      { name: "Gordon's Tonic", price: 35, description: "Gin Gordon's, limão e tônica" },
      { name: "Gordon's Strawberry", price: 38, description: "Gin Gordon's, morango, Monin e tônica" },
      { name: "Gordon's Tropical", price: 42, description: "Gin Gordon's, Red Bull Tropical e laranja" },
      { name: "Gordon's Melancia", price: 42, description: "Gin Gordon's e Red Bull Melancia" },
      { name: "Gordon's Passion", price: 38, description: "Gin Gordon's, frutas vermelhas, Monin e tônica" },
      { name: "Gordon's Sunset", price: 42, description: "Gin Gordon's, Red Bull morango e pêssego e frutas" }
    ]
  },
  {
    name: 'Doses',
    items: [
      { name: 'Ypióca', price: 8 },
      { name: 'Canelinha', price: 8 },
      { name: 'Bananinha', price: 8 },
      { name: 'Seleta', price: 10 },
      { name: 'Salinas', price: 10 },
      { name: 'José Cuervo', price: 25 },
      { name: 'Ballena', price: 28 },
      { name: 'Licor 43', price: 30 }
    ]
  },
  {
    name: 'Doses cowboy',
    items: [
      { name: 'Smirnoff', price: 25 },
      { name: 'Absolut', price: 28 },
      { name: "Gordon's", price: 25 },
      { name: 'Tanqueray', price: 30 },
      { name: 'Campari', price: 30 },
      { name: 'Red Label', price: 30 },
      { name: 'Black Label', price: 39 },
      { name: "Jack Daniel's", price: 36 }
    ]
  },
  {
    name: 'Cervejas',
    items: [
      { name: 'Litrão Budweiser', price: 22 },
      { name: 'Stella Pure Gold', price: 22 },
      { name: 'Corona', price: 21 },
      { name: 'Original', price: 19 },
      { name: 'Spaten', price: 18 },
      { name: 'Long neck Budweiser', price: 13 },
      { name: 'Long neck Spaten', price: 14 },
      { name: 'Long neck Corona', price: 16 },
      { name: 'Long neck Corona Cero', price: 16 }
    ]
  },
  {
    name: 'Long drinks',
    items: [
      { name: 'Smirnoff Ice', price: 16 },
      { name: 'Beats Senses', price: 18 },
      { name: 'Beats Green Mix', price: 18 },
      { name: 'Beats Red Mix', price: 18 }
    ]
  },
  {
    name: 'Drinks',
    items: [
      { name: 'Aperol Spritz', price: 39, description: 'Aperol, espumante seco e água com gás' },
      { name: 'Dama da Noite', price: 36, description: 'Drink à base de vodka e cranberry' },
      { name: 'Jorge Amado', price: 32, description: 'Maracujá, cachaça Gabriela, limão e gelo' },
      { name: 'Caipiroska Vanilla', price: 30, description: 'Absolut Vanilla, limão e gelo' },
      { name: 'Pink Gin', price: 42, description: 'Gin pink, pink lemonade, cranberry e espuma de morango' }
    ]
  },
  {
    name: 'Combos Red Bull',
    description: 'Garrafa + 5 Red Bulls',
    items: [
      { name: 'Smirnoff + 5 Red Bulls', price: 290 },
      { name: "Gordon's + 5 Red Bulls", price: 290 },
      { name: 'Red Label + 5 Red Bulls', price: 330 },
      { name: 'Absolut + 5 Red Bulls', price: 330 },
      { name: 'Tanqueray + 5 Red Bulls', price: 350 },
      { name: "Jack Daniel's + 5 Red Bulls", price: 360 },
      { name: 'Black Label + 5 Red Bulls', price: 370 },
      { name: 'Ciroc Red Berry + 5 Red Bulls', price: 420 }
    ]
  }
]

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 2 })

export function formatMenuPrice (price: number): string {
  return brl.format(price)
}

/** Seções do JSON-LD Menu (schema.org) com itens e preços. */
export function menuSchemaSections (sections: MenuSection[] = menuSections) {
  return sections.map(section => ({
    '@type': 'MenuSection',
    name: section.name,
    ...(section.description ? { description: section.description } : {}),
    hasMenuItem: section.items.map(item => ({
      '@type': 'MenuItem',
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
      offers: { '@type': 'Offer', price: item.price.toFixed(2), priceCurrency: 'BRL' }
    }))
  }))
}
