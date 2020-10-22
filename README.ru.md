# @funboxteam/markdown-lint

<img align="right" width="192" height="159"
     alt="Аватар: Яркое градиентное лого Markdown со звёздочкой"
     src="./logo.png">

[![npm](https://img.shields.io/npm/v/@funboxteam/markdown-lint.svg)](https://www.npmjs.com/package/@funboxteam/markdown-lint)

Консольная утилита для проверки Markdown-файлов на соответствие указанным
стандартам качества.

## Мотивация

Порой репозитории с проектами содержат большое количество файлов с
документацией. Однажды мы решили начать проверять грамматику и орфографию в
таких файлах, и создали для этих целей
[languagetool-node](https://github.com/funbox/languagetool-node).

В то же время мы решили проверять синтаксис Markdown-файлов, как мы проверяем
JS, CSS и иные файлы проекта. Потому создали этот линтер.

## Установка

Для глобальной установки и использования CLI-утилиты:

```bash
npm install -g @funboxteam/markdown-lint
```

Для установки и настройки на pre-commit хук:

```bash
npm install --dev husky lint-staged @funboxteam/markdown-lint
```

## Настройка проекта

Для автоматической проверки файлов перед коммитом необходимо настроить `husky` и
`lint-staged` на работу с `markdown-lint` в `package.json` вашего проекта.

Пример конфигурации:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.md": [
      "markdown-lint --fix --typograph"
    ]
  }
}
```

## Работа с CLI

Для ручной проверки файлов или директорий можно обращаться к `markdown-lint` из
командной строки:

```bash
# проверка файла на наличие ошибок
markdown-lint README.md

# проверка файлов внутри директории (без поиска в поддиректориях)
markdown-lint ./docs

# проверка файлов внутри директории (с поиском в поддиректориях)
markdown-lint -r ./docs

# проверка файла и автоматическое исправление ошибок
markdown-lint --fix README.md
```

### Доступные флаги

- `--fix` — автоматическое исправление ошибок;
- `--ext <value>` — указание расширений файлов; допустимо последовательное
  указание нескольких расширений, например `--ext apib --ext txt`. По умолчанию
  `md`;
- `-t, --typograph` — типографирование текста;
- `-r, --recursive` — поиск файлов не только внутри указанной директории, но и
  во всех поддиректориях;
- `-c, --config <file>` — подключение внешнего файла с конфигурацией линтера;
- `-v, --version` — вывод текущей версии линтера;
- `-h, --help` — вывод справки.

## Конфигурация линтера

Работа линтера основана на Markdown-процессоре
[remark](https://github.com/remarkjs/remark).

Линтинг производится с помощью библиотеки
[remark-lint](https://github.com/remarkjs/remark-lint) и набора правил
[remark-preset-lint-markdown-style-guide](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide#rules).

Для тонкой настройки линтера нужно создать файл конфигурации и с помощью флага
`--config` указать путь до него:

```bash
markdown-lint --fix --config ~/.markdownlintrc.js README.md
```

Пример конфигурации:

```javascript
module.exports = {
  // prettier обрабатывает тексты, когда `--fix` передан
  prettier: {
    // автоматически ограничиваем длину строки в 120 символов
    printWidth: '120'
  },

  remark: {
    // применяем настройки для remark-lint
    plugins: [
      // объявляем линтеру, что максимальная длина строки теперь равна 120 символам
      [require('remark-lint-maximum-line-length'), 120],

      // отключаем правило `no-inline-padding`
      [require('remark-lint-no-inline-padding'), false],

      // объявляем линтеру, что мы теперь используем `*` как маркер списка
      [require('remark-lint-unordered-list-marker-style'), '*']
    ],

    // remark-stringify обрабатывает тексты, когда `--fix` передан
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

### До обработки с флагом `--fix`

```markdown
Linux kernel
============

There are several guides for kernel developers and users. These guides can be rendered in a number of formats, like HTML and PDF. Please read Documentation/admin-guide/README.rst first.

In order to build the documentation, use ``make htmldocs`` or ``make pdfdocs``.  The formatted documentation can also be read online at:

    https://www.kernel.org/doc/html/latest/

There are various text files in the Documentation/ subdirectory, several of them using the Restructured Text markup notation.

Please read the Documentation/process/changes.rst file, as it contains the requirements for building and running the kernel, and information about the problems which may result by upgrading your kernel.

__Useful links__

* [Linux kernel licensing rules](https://www.kernel.org/doc/html/latest/process/license-rules.html#kernel-licensing)
* [Reporting bugs](https://www.kernel.org/doc/html/latest/admin-guide/reporting-bugs.html)
```

### После обработки

````markdown
# Linux kernel

There are several guides for kernel developers and users. These guides can be
rendered in a number of formats, like HTML and PDF. Please read
Documentation/admin-guide/README.rst first.

In order to build the documentation, use `make htmldocs` or `make pdfdocs`. The
formatted documentation can also be read online at:

```
https://www.kernel.org/doc/html/latest/
```

There are various text files in the Documentation/ subdirectory, several of them
using the Restructured Text markup notation.

Please read the Documentation/process/changes.rst file, as it contains the
requirements for building and running the kernel, and information about the
problems which may result by upgrading your kernel.

**Useful links**

- [Linux kernel licensing rules](https://www.kernel.org/doc/html/latest/process/license-rules.html#kernel-licensing)
- [Reporting bugs](https://www.kernel.org/doc/html/latest/admin-guide/reporting-bugs.html)
````

## Благодарности

Яркую картинку для репозитория нарисовал
[Игорь Гарибальди](https://pandabanda.com/).

[![Sponsored by FunBox](https://funbox.ru/badges/sponsored_by_funbox_centered.svg)](https://funbox.ru)
