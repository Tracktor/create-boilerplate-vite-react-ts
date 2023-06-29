# create-boilerplate-vite-react-ts

[![npm version](https://badge.fury.io/js/create-boilerplate-vite-react-ts.svg)](https://badge.fury.io/js/create-boilerplate-vite-react-ts)

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
- 🚜 **[eslint-config-react-tracktor](https://www.npmjs.com/package/eslint-config-react-tracktor)** - Simply the best eslint config for React

## Quick Start

**npm:**
```console
npm create boilerplate-vite-react-ts YOUR_APP_NAME
```
**Yarn**:
```console
yarn create boilerplate-vite-react-ts YOUR_APP_NAME
```
**pnpm**:
```console
pnpm create boilerplate-vite-react-ts YOUR_APP_NAME
```

## Optional params

You can add some params to install and configure automatically
some popular libraries.

| Name           | Description                  | Documentation                                   |
|----------------|------------------------------|-------------------------------------------------|
| `axios`        | Install axios library        | [axios](https://axios-http.com/fr/docs/intro)   |
| `i18next`      | Install i18next library      | [i18next](https://www.i18next.com)              |
| `react-query`  | Install react query library  | [react-query](https://react-query.tanstack.com) |
| `react-router` | Install react router library | [react-router](https://reactrouter.com)         |
<br>
example:

```console
npm create boilerplate-vite-react-ts YOUR_APP_NAME --axios --i18next
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
        └── Utils
            Router.tsx (optional if react-router is installed)
    └── config
        axios.config.ts (optional if axios is installed)
        i18next.config.ts (optional if i18next is installed)
        reactQuery.config.ts (optional if react-query is installed)
        test.config.ts
    └── constants
        routes.ts (optional if react-router is installed)
    └── context
    └── features
    └── hooks
    └── locales
    └── pages
        Contact.tsx (optional if react-router is installed)
        Home.tsx (optional if react-router is installed)
    └── services
    └── stores
    └── types
        i18next.d.ts (optional if i18next is installed)
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
[lockfile]
```
