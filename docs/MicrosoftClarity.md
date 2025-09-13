# 📘 Documentação – Microsoft Clarity

## 🔹 1. O que é o Microsoft Clarity?

O Microsoft Clarity é uma ferramenta gratuita de análise de comportamento de usuários.
Com ele, você pode acompanhar:

- Sessões e visitantes
- Tempo no site
- Heatmaps (mapas de calor)
- Gravações de sessões
- Cliques, scroll, "rage clicks"
- Eventos customizados

## 🔹 2. Instalação

### 2.1. Criar plugin no Nuxt

📁 **Arquivo:** `plugins/clarity.client.ts`

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
export default defineNuxtPlugin(() => {
  if (import.meta.client && process.env.NODE_ENV === 'production') {
    // Initialize Microsoft Clarity using the official script method
    (function (c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
      c[a] = c[a] || function (...args: any[]) {
        (c[a].q = c[a].q || []).push(args)
      }
      t = l.createElement(r)
      t.async = 1
      t.src = 'https://www.clarity.ms/tag/' + i
      y = l.getElementsByTagName(r)[0]
      y.parentNode.insertBefore(t, y)
    })(window, document, 'clarity', 'script', 'SEU_PROJECT_ID', undefined, undefined)
  }
})
```

⚠️ **O Project ID é encontrado no snippet fornecido pelo Clarity:**

```javascript
... "clarity", "script", "t8ownucnt6");
```

👉 Nesse caso, o ID é `t8ownucnt6`.

## 🔹 3. Uso básico

### 3.1. Inicialização

O Clarity é carregado automaticamente pelo plugin acima.

### 3.2. Enviar eventos customizados
Você pode rastrear interações específicas:

```vue
<script setup lang="ts">
import clarity from "@microsoft/clarity";

function trackBuyClick() {
  clarity.event("buy_button_click");
}
</script>

<template>
  <button @click="trackBuyClick">Comprar</button>
</template>
```

No painel do Clarity → **Filters** → **Events**, o evento aparecerá.

## 🔹 4. Composable (opcional)

Para facilitar o uso em todo o app, crie um composable:

📁 **Arquivo:** `composables/useClarity.ts`

```typescript
// Declare the global clarity function
declare global {
  interface Window {
    clarity: (action: string, ...args: unknown[]) => void
  }
}

export function useClarity () {
  const trackEvent = (name: string) => {
    if (import.meta.client && typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', name)
    }
  }

  return { trackEvent }
}
```

**Uso em qualquer componente:**

```vue
<script setup lang="ts">
const { trackEvent } = useClarity();
</script>

<template>
  <button @click="trackEvent('buy_button_click')">Comprar</button>
</template>
```

## 🔹 5. Outros métodos úteis

A biblioteca também oferece:

- `clarity.setTag("chave", "valor")` → marca a sessão com um rótulo (ex: plano contratado)
- `clarity.identify("user_123")` → identifica o usuário (ex: ID do cliente)
- `clarity.consent(true|false)` → define se a coleta pode ou não ocorrer (útil com LGPD/GDPR)

## 🔹 6. Boas práticas

- Sempre inicialize o Clarity apenas em produção
- Use eventos customizados para ações importantes (cliques em botões, conclusão de compra, etc)
- Combine Clarity com Google Analytics para ter tanto dados de comportamento quanto métricas de tráfego
- Evite enviar informações pessoais (nome, e-mail, telefone) como evento → mantenha apenas dados anônimos