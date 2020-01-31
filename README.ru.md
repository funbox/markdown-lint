# @funboxteam/markdown-lint

**markdown-lint** — это CLI-утилита для проверки файлов с Markdown-разметкой на
соответствие внутренним стандартам качества отдела фронтенда.

## Установка

Для установки и настройки на pre-commit хук:

```bash
npm install --dev husky lint-staged @funboxteam/markdown-lint
```

Для глобальной установки и использования CLI-утилиты:

```bash
npm install -g @funboxteam/markdown-lint
```

## Настройка проекта

Для автоматической проверки md-файлов перед коммитом необходимо настроить
`husky` и `lint-staged` на работу с `markdown-lint`.

Настройка производится в файле `package.json`.

Пример конфигурации:

```json
"husky": {
  "hooks": {
    "post-commit": "git update-index --again",
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "linters": {
    "*.md": [
      "markdown-lint --fix --typograph",
      "git add"
    ]
  },
  "renderer": "silent"
}
```

## Работа с CLI

Для ручной проверки файлов или директорий можно обращаться к `markdown-lint` из
командной строки:

```bash
# проверка файла на наличие ошибок
markdown-lint README.md

# проверка md-файлов внутри директории
markdown-lint ./docs

# проверка файла и автоматическое исправление ошибок
markdown-lint --fix README.md
```

### Доступные флаги

- `--fix` — автоматическое исправление ошибок;
- `--ext <value>` — указание расширений файлов; допустимо последовательное указание нескольких расширений (например, `--ext apib --ext txt`). По умолчанию `md`;
- `-t, --typograph` — оттипографить текст;
- `-r, --recursive` — поиск md-файлов не только внутри указанной директории, но
  и во всех поддиректориях;
- `-c, --config <file>` — подключение внешнего файла с конфигурацией линтера;
- `-v, --version` — вывод текущей версии линтера;
- `-h, --help` – вывод справки.

## Конфигурация линтера

Работа линтера основана на markdown-процессоре
[remark](https://github.com/remarkjs/remark).

Линтинг производится с помощью библиотеки
[remark-lint](https://github.com/remarkjs/remark-lint) и набора правил
[remark-preset-lint-markdown-style-guide](https://github.com/remarkjs/remark-lint/tree/master/packages/remark-preset-lint-markdown-style-guide#rules).

При использовании флага `--ext` можно проверять файлы указанных расширений. Пример вызова:
```bash
  markdown-lint ./docs --ext apib --ext txt
```
Если флаг не указан, по умолчанию проверяются файлы `md`.

При использовании флага `--fix` содержимое файла прогоняется через
[remark-stringify](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#api)
и [prettier](https://prettier.io/docs/en/index.html).

Если активен флаг `--typograph`, то текст прогоняется через
[typograf](https://github.com/typograf/typograf) и
[eyo-kernel](https://github.com/hcodes/eyo-kernel).

Флаг `--recursive` позволяет искать файлы для проверки не только в указанной директории, но и в
ее поддиректориях. Например, если структура директории выглядит так:

```
├── docs
|   ├── api
|   |   ├── post-entity.apib
|   |   └── get-entity.apib
|   └── manuals
└──     └── manual.md
```
то вызов
```bash
markdown-lint --recursive ./docs --ext apib
```

проверит вложенные файлы `post-entity.apib`, `get-entity.apib`, `manual.md`.

Для тонкой настройки линтера нужно создать файл конфигурации и с помощью флага
`--config` указать путь до него:

```bash
markdown-lint --fix --config ~/.markdownlintrc.js README.md
```

Пример конфигурации:

```javascript
module.exports = {
  prettier: {
    // автоматически ограничиваем длину строки в 120 символов
    printWidth: '120'
  },

  remark: {
    // применяем настройки для `remark-lint`
    plugins: [
      // объявляем линтеру, что максимальная длина строки теперь равна 120 символам
      [require('remark-lint-maximum-line-length'), 120],

      // отключаем правило `no-inline-padding`
      [require('remark-lint-no-inline-padding'), false],

      // объявляем линтеру, что мы теперь используем `*` как маркер списка
      [require('remark-lint-unordered-list-marker-style'), '*']
    ],

    // применяем настройки для `remark-stringify`
    stringifySettings: {
      // автоматически заменяем все маркеры списка на `*`
      bullet: '*'
    }
  },

  typograf: {
    // API настроек — https://github.com/typograf/typograf/blob/dev/docs/api_rules.md
    // список правил — https://github.com/typograf/typograf/blob/dev/docs/RULES.ru.md
    locale: ['ru', 'en-US'],
    enableRules: [],
    disableRules: [
      // обязательное отключение следующих правил требуется для правильной работы типографа
      'common/space/delTrailingBlanks',
      'common/space/trimLeft',
      'common/space/trimRight'
    ],
    rulesSettings: []
  }
};
```

## Пример работы

### До обработки с флагом `--fix`

<!-- prettier-ignore-start -->

```markdown
# Данные для выполнения сценариев

__Регистрация__

* номер: `9000000000  `, код выводится через  ` alert `

**Авторизация**

* номер: `  9050000000 `, пароль: `password`
* номер: `9000000001`, пароль: `password`
* новый пароль: `novice`

__Отписка от сервиса__

* подписанный аккаунт, номер: `9000000002`, пароль: `password`

При переходе на страницу `/unsubscription` произойдёт отписка и сообщение об этом со ссылкой на главную, после перехода на главную и возвращения (без обновления страницы, кнопкой «Назад») на `/unsubscribed` будет сообщение, что пользователь отписан и ссылка на подписку.
```

<!-- prettier-ignore-end -->

### После обработки

```markdown
# Данные для выполнения сценариев

**Регистрация**

- номер: `9000000000`, код выводится через `alert`

**Авторизация**

- номер: `9050000000`, пароль: `password`
- номер: `9000000001`, пароль: `password`
- новый пароль: `novice`

**Отписка от сервиса**

- подписанный аккаунт, номер: `9000000002`, пароль: `password`

При переходе на страницу `/unsubscription` произойдёт отписка и сообщение об
этом со ссылкой на главную, после перехода на главную и возвращения (без
обновления страницы, кнопкой «Назад») на `/unsubscribed` будет сообщение, что
пользователь отписан и ссылка на подписку.
```
