# Vika Parking

Личный веб‑тренажёр парковки для Вики.

## Стек
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- PixiJS (Canvas рендер)
- Framer Motion
- Zustand
- Supabase (Auth + DB)

## Запуск локально

```bash
pnpm install
pnpm dev
```

## Деплой

Проект рассчитан на Vercel.

1. Создайте проект в Vercel.
2. Добавьте переменные окружения  
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Подключите Git‑репозиторий и нажмите **Deploy**.

После деплоя переход на `/intro`.
