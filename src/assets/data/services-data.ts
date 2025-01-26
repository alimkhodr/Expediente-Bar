import massagem from "./../images/massagem-relaxante.webp"
import boca from "./../images/boca.webp"
import limpezaDePele from "./../images/limpeza-de-pele.webp"
import ciclios from "./../images/cilios.webp"
import depilacaoLazer from "./../images/depilacao-lazer.webp"
import sobrancelha from "./../images/sobrancelha.webp"

const services = [
  {
    title: 'Sobrancelhas',
    img: sobrancelha,
    items: [
      {
        category: '',
        service: [
          { text: 'Design de sobrancelhas', price: '42,00' },
          { text: 'Tinturinha/Henna', price: '31,00' },
          { text: 'Brow Lamination', price: '149,00' },
          { text: 'Nanoblading', price: '389,00' },
          { text: 'Retoque Nanoblading', price: '40,00' },
        ],
      },
    ]
  },
  {
    title: 'Cílios',
    img: ciclios,
    items: [
      {
        category: '',
        service: [
          { text: 'Cílios completo', price: '180,00' },
          { text: 'Manutenção 50%', price: '99,00' },
          { text: 'Manutenção 70%', price: '149,00' },
          { text: 'Coloração dos cílios', price: '40,00' },
          { text: 'Lash Lifting', price: '159,00' },
        ],
      },
    ]
  },
  {
    title: 'Boca',
    img: boca,
    items: [
      {
        category: '',
        service: [
          { text: 'Hidragloss', price: '149,00' },
          { text: 'Hidragloss com cor', price: '190,00' },
          { text: 'Micropigmentação Labial', price: '490,00' },
        ],
      },
    ]
  },
  {
    title: 'Estetica Facial',
    img: limpezaDePele,
    items: [
      {
        category: '',
        service: [
          { text: 'Limpeza de pele', price: '149,00' },
          { text: 'Dermaplaning', price: '129,00' },
          { text: 'Peeling químico Retinol', price: '99,00' },
          { text: 'Peeling químico TCA', price: '149,00' },
          { text: 'Revitalização', price: '79,00' },
          { text: 'Nutrição', price: '79,00' },
          { text: 'Drenagem Linfática', price: '69,00' },
          { text: 'Fotobiomodulação (sessão)', price: '39,00' },
        ],
      },
    ]
  },
  {
    title: 'Tratamentos Corporais',
    img: massagem,
    items: [
      {
        category: '',
        service: [
          { text: 'Massagem relaxante 50’', price: '129,00' },
          { text: 'Drenagem linfática 50’', price: '129,00' },
          { text: 'Gomage com massagem relaxante 30’', price: '189,00' },
          { text: 'Banho de lua & Gomage com massagem relaxante 30’', price: '239,00' },
        ],
      }
    ]
  },
  {
    title: 'Depilação Lazer',
    img: depilacaoLazer,
    items: [
      {
        category: 'FEMININA',
        service: [
          { text: 'Buço', price: '52,00' },
          { text: 'Queixo/Pescoço', price: '52,00' },
          { text: 'Lateral do Rosto', price: '52,00' },
          { text: 'Rosto Completo', price: '120,00' },
          { text: 'Axilas', price: '79,00' },
          { text: 'Linha Alba', price: '35,00' },
          { text: 'Braços', price: '139,00' },
          { text: 'Íntima Completa', price: '189,00' },
          { text: 'Íntima Simples', price: '105,00' },
          { text: 'Coxas', price: '129,00' },
          { text: 'Meia Perna', price: '129,00' },
          { text: 'Perna', price: '259,00' },
          { text: 'Costas', price: '189,00' },
        ],
      },
      {
        category: 'MASCULINA',
        service: [
          { text: 'Barba Completa', price: '179,00' },
          { text: 'Pescoço e Maçãs', price: '79,00' },
          { text: 'Axilas', price: '89,00' },
          { text: 'Braços', price: '159,00' },
          { text: 'Costas', price: '239,00' },
          { text: 'Abdômen e Tórax', price: '269,00' },
          { text: 'Pernas', price: '289,00' },
        ],
      },
    ],
  },
];

export default services;
