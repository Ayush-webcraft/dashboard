# Howdz Dashboard

A customizable browser start page built with Vue 3 + TypeScript + Vite. Supports drag-and-drop component layout, theme switching, wallpaper configuration, multiple tabs, and more.

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Dev server http://localhost:5222
npm run build      # CDN build (output: dist/)
npm run build:crx  # Chrome extension build (output: crx/)
npm run lint       # oxlint src
```

## Tech Stack

- **Vue 3** + TypeScript + `<script setup>` + JSX (settings files)
- **Vite 5**, path alias `@` -> `src/`
- **Pinia** + pinia-plugin-persistedstate (localStorage / sessionStorage)
- **Element Plus** (on-demand import, registered in `src/main.ts`)
- **vue-i18n** (zh-cn / en, language files in `src/lang/locales/`)
- **vue-grid-layout** responsive grid layout
- **Milkdown** Markdown editor (v5.3.1)
- **SCSS** + `@emotion/css` dynamic styling
- **dayjs** date formatting

## Project Structure

```
src/
  main.ts              # App entry point, Element Plus on-demand registration, ServiceWorker registration
  App.vue              # Root component
  global.ts            # API base URL & publicPath config (per environment)
  store/index.ts       # Pinia state management (config, list, affix, global, tabList)
  materials/           # Material components (each contains index.vue + setting.tsx)
  components/          # App shell: layout, config panels, global effects, utility components
  lang/                # i18n: index.ts + locales/
  utils/               # Utility functions: color, font, gzip, images, request, preview-mode
  hooks/               # Composables (useScreenMode)
  plugins/             # Position selector, standard forms, context menu, local images
  types/                # TypeScript type declarations (global.d.ts, index.d.ts)
  constanst/            # Constants: MATERIAL_LIST_MAP, BG_IMG_TYPE_MAP, DAILY_HOT_CLASSIFY
  assets/               # SCSS styles, images, icons
```

## Material Components

Each component lives under `src/materials/<Name>/`:
- `index.vue` — runtime component
- `setting.tsx` — settings form (JSX)
- optional subcomponents (e.g. `Bookmark/ConfigDialog.vue`)

Available components: Empty, Clock, Day, Verse, Search, Collection, Bookmark, Iframe, TodoList, Weather, CountDown, Editor, MovieLines, DailyHot, JuejinList, WeiboList, GithubTrending, ZhihuList

## Two Layout Modes

1. **Responsive (document flow)** — `list` array, uses vue-grid-layout
2. **Fixed (absolute positioning)** — `affix` array, absolute positioning

Both modes are stored in the Pinia store's `list` and `affix`.

## State & Persistence

The Pinia store (`src/store/index.ts`) persists to localStorage (sessionStorage in preview mode). Key data slices: `list`, `affix`, `global`, `tabList`, `wallpaperCollectionList`.

## Build Modes

- `npm run build` — CDN mode, assets loaded from `https://cdn.kongfandong.cn/howdz/dist/`
- `npm run build:crx` — Chrome extension mode, uses relative paths, output to `crx/`

## Dev Proxy

`/api` proxies to `http://kongfandong.cn` (see `vite.config.ts`).

## Linting

Uses **oxlint** (eslint is no longer used at runtime). The ESLint config is only for IDE support. Run: `npm run lint` (oxlint src).

## Development Conventions

- Commit messages follow **Conventional Commits** (commitlint + husky)
- Use `npm run commit` (commitizen) for interactive commits
- PascalCase component names are allowed (vue/multi-word-component-names is disabled)
- `@typescript-eslint/no-explicit-any` is disabled — `any` is allowed
- SCSS variables are globally injected via `additionalData` in `vite.config.ts` (`@/assets/element-variables`)
- CSS class names use kebab-case
- Component settings use JSX (`.tsx`), rendered with `defineComponent` + `h()`

## Key Files

- `vite.config.ts` — build config, aliases, plugins, proxy, global SCSS injection
- `src/main.ts` — app bootstrap, Element Plus registration, ServiceWorker, preview mode
- `src/store/index.ts` — global state, persistence config
- `src/constanst/index.ts` — material registry, hot-search sources
- `src/materials/base.tsx` — material component base wrapper/shared logic
- `src/components/Layout.vue` — main layout controller
- `index.html` — HTML shell, includes loading animation, CSS/JS injection slots
