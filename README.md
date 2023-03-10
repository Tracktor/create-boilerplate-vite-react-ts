# create-boilerplate-vite-react-ts

> Create quickly a skeleton of `Vite React TypeScript`
application with amazing configuration.

- [Features included](#Features-included)
- [Quick Start](#Quick-Start)
- [Optional params](#Optional-params)
- [Files structure](#Files-structure)

## Features included

- 📦 **[React](https://fr.reactjs.org)** - v18+ with Hooks
- ⚡️ **[Vite](https://vitejs.dev)** - Next Generation Frontend Tooling
- 🚀 **[Vitest](https://vitest.dev)** - A Vite native unit test framework. It's fast!
- 🛠️ **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)** - React DOM testing
  utilities
- 🐶 **[Husky](https://typicode.github.io/husky)** - Modern native git hooks made easy
- 📐 **[ESLint](https://eslint.org)** - Code analyzer
- 🚜 **[eslint-config-react-tracktor](https://eslint.org)** - Simply the best eslint config for React

## Quick Start

```console
npx create-boilerplate-vite-react-ts YOUR_APP_NAME
```

## Optional params

You can add some params to install automatically 
popular libraries with sweet config.

| Name           | Description                  |
|----------------|------------------------------|
| `axios`        | Install axios library        |
| `i18next`      | Install i18next library      |
| `react-query`  | Install react query library  |
| `react-router` | Install react router library |

example:

```console
npx create-boilerplate-vite-react-ts YOUR_APP_NAME --axios --i18next
```

## Files structure

```
├── .husky
    pre-commit
├── public
    favicon.ico
└── src
    └── assets
    └── components
        └── DataDisplay
        └── Feedback
        └── Inputs
        └── Layout
        └── Navigation
        └── Surfaces
        └── Template
        └── Utils
    └── config
        setupTests.ts
    └── constants
    └── context
    └── features
    └── hooks
    └── locales
    └── pages
    └── services
    └── stores
    └── types
        vite-env.d.ts
    └── utils
    App.test.tsx
    App.tsx
.eslintignore
.eslintrc.json
.gitignore
index.html
index.tsx
package.json
README.md
tsconfig.json
tsconfig.node.json
vite.config.ts
yarn.lock
```
