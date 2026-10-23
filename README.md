# Лендінг «Облік супермаркету» — Payload CMS + TypeScript + Neon + Vercel

Fullstack-застосунок: контент лендінгу редагується в Payload CMS (блоки), зберігається в Postgres на Neon, а клієнт на TypeScript завантажує його через API й малює шаблони блоків зі станами loading / error / ready.

## 1. Архітектура (монорепозиторій, npm workspaces)

```
packages/types   @landing/types  — спільні TS-типи сторінки й блоків
apps/cms         @landing/cms    — Payload 3 + Next.js (адмінка + REST API)
apps/web         @landing/web    — клієнт: Vite + TypeScript (без фреймворка)
```

**Payload (`apps/cms/src`)**
- `collections/Pages.ts` — сторінка: `title`, `slug`, `footer`, поле `blocks`.
- `blocks.ts` — типи блоків: `hero`, `features`, `steps`, `faq`.
- `collections/Media.ts` — завантаження зображень (Vercel Blob на проді).
- `collections/Users.ts` — користувачі адмінки.
- `payload.config.ts` — Postgres-адаптер (Neon), CORS/CSRF, плагін Blob.

**Кастомні API-ендпоінти**
| Метод | URL | Призначення |
|---|---|---|
| GET | `/api/pages/by-slug/:slug` | сторінка з блоками; помилки `400/404/500` у форматі `{ "error": "..." }` |
| GET | `/api/health` | перевірка, що API живе |

## 2. Клієнт і стани UI (`apps/web/src`)
- `api.ts` — `fetchPage()` (async/fetch, `AbortController`), клас `ApiError`, type guard `isPage()` перевіряє форму відповіді.
- `render.ts` — шаблони блоків; `renderBlock()` — `switch` по `blockType` з перевіркою вичерпності (`never`); `renderState()` — екрани `loading` / `error` (з кнопкою «Спробувати ще раз») / `ready`.
- `styles.css` — адаптивна верстка (grid `auto-fit`, бургер-меню до 760px, `prefers-reduced-motion`).
- Інша сторінка: `?page=<slug>`.

## 3. Типізація (`packages/types/src/index.ts`)
- **Type Aliases:** `BlockType`, `IconName`, `Media`, `Timestamps`, `FeatureItem`.
- **Union Types:** `PageBlock = HeroBlock | FeaturesBlock | StepsBlock | FaqBlock` (discriminated union за `blockType`); `LoadState<T>` = `loading | error | ready`.
- **Intersection Types:** `HeroBlock = BlockBase<'hero'> & {...}`, `Page = {...} & Timestamps`.
- **Типізовані функції й API:** `fetchPage(): Promise<Page>`, `isPage(v: unknown): v is Page`, `renderBlock(b: PageBlock, i: number): string`; ендпоінт повертає `Page | ApiErrorBody`.

## 4. Запуск локально
```bash
npm install
cp .env.example apps/cms/.env      # DATABASE_URI (Neon), PAYLOAD_SECRET, WEB_URL
echo "VITE_API_URL=http://localhost:3000" > apps/web/.env
npm run dev:cms                    # http://localhost:3000/admin — створіть першого користувача
npm run seed                       # наповнює сторінку "home" (запускати після першого старту CMS)
npm run dev:web                    # http://localhost:5173
```
Перевірка типів: `npm run typecheck`.

## 5. Деплой (Neon + Vercel)
1. **Neon:** створіть проєкт → скопіюйте connection string (`?sslmode=require`) у `DATABASE_URI`.
2. **GitHub:** запуште репозиторій.
3. **Vercel, проєкт №1 (CMS):** Root Directory `apps/cms`, framework Next.js. Env: `DATABASE_URI`, `PAYLOAD_SECRET`, `WEB_URL` (URL клієнта). Storage → Blob → створіть store (з’явиться `BLOB_READ_WRITE_TOKEN`).
4. **Vercel, проєкт №2 (клієнт):** Root Directory `apps/web`, framework Vite. Env: `VITE_API_URL` = URL CMS. Увімкніть «Include files outside the root directory».
5. Відкрийте `<CMS>/admin`, створіть адміна, виконайте `npm run seed` локально з тим самим `DATABASE_URI` (або створіть сторінку `home` вручну).

## 6. Контрольний приклад (скріншоти)
Покласти файли в `docs/screenshots/`:

| # | Сценарій | Що зробити | Файл |
|---|---|---|---|
| 1 | Редактор у CMS | `/admin` → Pages → home: змінити заголовок Hero → Save | `01-cms-editor.png` |
| 2 | Відвідувач | відкрити сайт, оновити — видно новий заголовок | `02-site-ready.png` |
| 3 | Завантаження | DevTools → Network → Slow 3G → оновити | `03-loading.png` |
| 4 | Помилка 404 | відкрити `/?page=nope` | `04-error-404.png` |
| 5 | Помилка мережі | зупинити CMS або Offline → оновити → «Спробувати ще раз» | `05-error-network.png` |

![CMS](docs/screenshots/01-cms-editor.png)
![Сайт](docs/screenshots/02-site-ready.png)
![404](docs/screenshots/04-error-404.png)
