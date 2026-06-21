# Vika Parking

Личный веб‑тренажёр парковки для Вики: романтичное интро, вход только для неё, dashboard, практика, Canvas‑симулятор Skoda Octavia, точная синяя траектория, идеальная линия, машина‑призрак, подсказки, настройки.

## Важно: исправленная ошибка Vercel

В предыдущей версии Vercel падал на:

```txt
Module not found: Can't resolve '@/components/simulator/SimulatorCanvas'
```

В этой версии исправлено:
- добавлен `app/layout.tsx`;
- добавлен `components/simulator/SimulatorCanvas.tsx`;
- добавлены `baseUrl` и `paths` в `tsconfig.json`;
- убран устаревший `experimental.appDir` из `next.config.js`;
- симулятор сделан на чистом Canvas, без PixiJS, чтобы не было проблем с SSR/webpack.

## Запуск

```bash
npm install
npm run dev
```

Открыть:

```txt
http://localhost:3000/intro
```

## Вход

По умолчанию секретный код:

```txt
vika
```

Можно поменять через Vercel env:

```txt
NEXT_PUBLIC_VIKA_CODE=любой_секретный_код
```

## Supabase

Для email-входа добавить в Vercel:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

SQL-схема находится в:

```txt
supabase/schema.sql
```

## Деплой на Vercel

```bash
git add .
git commit -m "feat: complete Vika Parking app with canvas simulator and fixed build"
git push origin main
```
