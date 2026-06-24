# 5 комплиментов для Ильи

Чистое Next.js приложение без Tailwind, PostCSS, framer-motion и lucide-react.

## Что есть

- 5 экранов;
- 4 комплимента;
- последний экран — конверт;
- конверт открывается по клику;
- внутри финальный текст;
- прогресс сохраняется в localStorage;
- готово для Vercel.

## Важно для деплоя в старый репозиторий

Перед заливкой удалить старые папки и конфиги:

```bash
rm -rf components lib store public
rm -f postcss.config.js postcss.config.mjs tailwind.config.ts tailwind.config.js
rm -f package-lock.json
```

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```


## Fix envelope

Исправлена сцена конверта:
- письмо больше не перекрывается клапаном;
- текст читается полностью;
- конверт адаптирован под широкий экран и телефон.
