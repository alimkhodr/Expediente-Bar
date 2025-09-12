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

### 2.1. Instalar via npm

```bash
npm install @microsoft/clarity
# ou
yarn add @microsoft/clarity
```

### 2.2. Criar plugin no Nuxt

📁 **Arquivo:** `plugins/clarity.client.ts`

```typescript
import clarity from "@microsoft/clarity";

export default defineNuxtPlugin(() => {
  if (import.meta.client && process.env.NODE_ENV === "production") {
    clarity.init("SEU_PROJECT_ID"); // substitua pelo ID do Clarity
  }
});
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
import clarity from "@microsoft/clarity";

export function useClarity() {
  const trackEvent = (name: string) => {
    if (import.meta.client) {
      clarity.event(name);
    }
  };

  return { trackEvent };
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