# create-boilerplate-vite-react-ts

[![npm version](https://badge.fury.io/js/create-boilerplate-vite-react-ts.svg)](https://badge.fury.io/js/create-boilerplate-vite-react-ts)

> Create quickly a skeleton of `Vite React TypeScript`
application with amazing configuration.

- [Quick Start](#Quick-Start)
- [Optional params](#Optional-params)
- [Files structure](#Files-structure)

## Quick Start

**bun:**
```bash
bun create boilerplate-vite-react-ts YOUR_APP_NAME
```

**npm:**
```bash
npm create boilerplate-vite-react-ts YOUR_APP_NAME
```
**yarn**:
```bash
yarn create boilerplate-vite-react-ts YOUR_APP_NAME
```
**pnpm**:
```bash
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
    test.config.ts
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
[yarn.lock|pnpm-lock.yaml|package-lock.json|bun.lockb]
```
