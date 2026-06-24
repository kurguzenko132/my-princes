# Для Ильи — финальная простая версия

Я убрал сложный CSS-конверт полностью.

Теперь финальный экран работает так:

- до клика показывается большая кнопка с emoji-конвертом;
- после клика появляется отдельная белая карточка с финальным текстом;
- ничего не улетает;
- ничего не перекрывается;
- нет absolute-конверта, клапанов и треугольников.

## Важно при деплое поверх старого репозитория

```bash
rm -rf components lib store public
rm -f postcss.config.js postcss.config.mjs tailwind.config.ts tailwind.config.js
rm -f package-lock.json
```

## Запуск

```bash
npm install
npm run dev
npm run build
```
