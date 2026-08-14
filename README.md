# chatbot-widget

Widget de chat flotante, embebible en cualquier aplicación host sin asumir
nada sobre su framework, sus estilos o su esquema de autenticación. Todo lo
que necesita (backend, tenant, tema, tokens) se le inyecta al montarlo.

## Formas de consumo

El mismo build genera tres artefactos en `dist/`, para tres formas de
consumo distintas — usa la que corresponda al host:

| Consumidor | Artefacto | Cómo se usa |
|---|---|---|
| App React con su propio build (npm) | `chatbot-widget.es.js` / `.umd.js` | `import { initChatbot } from 'chatbot-widget'` |
| Cualquier sitio sin bundler | `chatbot-widget.standalone.js` | `<script src="...">`, expone `window.ChatbotWidget` |
| Host no-React (Vue, Angular, HTML plano) | `chatbot-widget-element.js` | `<script src="...">` + `<chatbot-widget>` |

Los tres se instalan igual (`npm install chatbot-widget`, o copiando/sirviendo
`dist/` desde un CDN interno) — la decisión de *dónde* publicarlo (registry
privado, público, o solo `dist/` distribuido a mano) queda abierta y no
condiciona el código: `package.json` ya expone `main`/`module`/`unpkg`/`exports`
apuntando a los tres artefactos.

## Quick start — host React

```bash
npm install chatbot-widget
```

```ts
import { initChatbot } from 'chatbot-widget'

const handle = initChatbot(document.body, {
  apiUrl: 'https://api.tu-backend.com',
  tenantId: 42,
  getAuthToken: () => currentUserSession.token,
})

// más adelante, al desmontar la app host:
handle.destroy()
```

## Quick start — sin bundler / CDN

```html
<script src="https://tu-cdn.com/chatbot-widget.standalone.js"></script>
<script>
  ChatbotWidget.initChatbot(document.body, {
    apiUrl: 'https://api.tu-backend.com',
    tenantId: 42,
  })
</script>
```

## Quick start — Vue / Angular / HTML plano (custom element)

```html
<script src="https://tu-cdn.com/chatbot-widget-element.js"></script>

<chatbot-widget api-url="https://api.tu-backend.com" tenant-id="42"></chatbot-widget>
```

Para configuración que no cabe en atributos HTML (tema, `getAuthToken`,
`headers`, `onError`), se asigna desde JS:

```js
document.querySelector('chatbot-widget').config = {
  apiUrl: 'https://api.tu-backend.com',
  tenantId: 42,
  getAuthToken: () => currentUserSession.token,
}
```

## `ChatbotConfig`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `apiUrl` | `string` | Sí | Base URL del backend. |
| `tenantId` | `string \| number` | Sí | Tenant/instancia a cargar. |
| `theme` | `ChatbotTheme` | No | Overrides de color/nombre/mensaje. Cualquier campo no seteado cae al valor que devuelva el backend para ese tenant. |
| `storageNamespace` | `string` | No | Namespace del `localStorage` del historial. Por defecto, `tenantId`. |
| `getAuthToken` | `() => string \| null \| Promise<...>` | No | Devuelve el token a mandar como `Authorization: Bearer <token>`. |
| `headers` | `object \| () => object` | No | Headers extra mezclados en cada request (cualquier esquema de auth que no sea Bearer). |
| `onError` | `(error, context) => void` | No | Se invoca en errores de red/config en vez de fallar en silencio. `context` es `"getSettings"` \| `"sendPrompt"` \| `"getAuthToken"`. |
| `useShadowDom` | `boolean` | No | Aísla el widget en Shadow DOM (por defecto `true`) para que el CSS del host y el de MUI/Emotion no se mezclen. Desactivar solo si una integración necesita alcanzar el DOM interno del widget. |

## Desarrollo local

```bash
cp .env.example .env   # ajusta VITE_API_URL / VITE_TENANT_ID
npm install
npm run dev
```

`src/main.tsx` es solo el arnés de desarrollo: llama a `initChatbot` igual que
lo haría cualquier host, usando las variables de entorno del `.env`.

## Scripts de build

| Script | Qué hace |
|---|---|
| `npm run build` | Build de la demo local (`dist-demo/`), la misma que sirve `npm run dev`/`npm run preview`. |
| `npm run build:dist` | Limpia `dist/` y genera los tres artefactos publicables (lib ESM/UMD + tipos, standalone IIFE, custom element IIFE). |
| `npm run build:lib` / `build:standalone` / `build:webcomponent` | Cada artefacto por separado. |
| `npm run build:types` | Solo los `.d.ts` (`dist/types/`). |

## Notas de aislamiento

- **CSS**: con `useShadowDom: true` (default), el widget crea su propio
  Shadow DOM y ata el `CacheProvider` de Emotion a un contenedor dentro de
  ese shadow root — los estilos de MUI/Emotion no llegan al `<head>` del
  host, y el CSS del host no puede afectar al widget.
- **Storage**: el historial de chat se guarda en `localStorage` bajo
  `chatbot:<storageNamespace>:chat`, nunca bajo una clave genérica —  dos
  tenants (o dos hosts) en la misma página no comparten historial.
- **Lifecycle**: `initChatbot` devuelve `{ destroy }`. Llamarlo antes de
  volver a inicializar el mismo contenedor evita listeners duplicados en
  `window` (drag del botón flotante).
- **Compatibilidad**: Shadow DOM y Custom Elements requieren navegadores
  modernos evergreen; no hay polyfills incluidos.
