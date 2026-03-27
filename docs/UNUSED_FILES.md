# Неиспользуемые файлы

## Файлы из стартового шаблона

Следующие файлы остались от стартового шаблона Vue и **не используются** в проекте:

```
src/components/
├── HelloWorld.vue       # НЕ ИСПОЛЬЗУЕТСЯ
├── TheWelcome.vue       # НЕ ИСПОЛЬЗУЕТСЯ
├── WelcomeItem.vue      # НЕ ИСПОЛЬЗУЕТСЯ
└── icons/               # НЕ ИСПОЛЬЗУЕТСЯ
    ├── IconCommunity.vue
    ├── IconDocumentation.vue
    ├── IconEcosystem.vue
    ├── IconSupport.vue
    └── IconTooling.vue
```

Эти файлы можно безопасно игнорировать. Они не импортируются нигде в проекте и не влияют на работу приложения.

## Почему не удалены?

MCP сервер task-flow не предоставляет функцию удаления файлов по соображениям безопасности. Файлы оставлены как есть, так как:
- Они не влияют на работу приложения
- Не импортируются нигде
- Не попадут в production build (tree-shaking)
- Занимают минимум места

## Если хотите удалить вручную

Вы можете удалить эти файлы вручную через файловую систему или IDE:

```bash
# Через командную строку (Windows)
del src\components\HelloWorld.vue
del src\components\TheWelcome.vue
del src\components\WelcomeItem.vue
rmdir /s src\components\icons

# Через командную строку (Linux/Mac)
rm src/components/HelloWorld.vue
rm src/components/TheWelcome.vue
rm src/components/WelcomeItem.vue
rm -rf src/components/icons
```

Или просто удалите через проводник/Finder/IDE.
