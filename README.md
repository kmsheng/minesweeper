# minesweeper
A sample game project using Vue and TypeScript.

<img src="https://user-images.githubusercontent.com/880569/162956984-bb1fa4c4-32bb-43bb-82f9-69e1a132ccc8.jpg" width="400">

## Project Setup

```sh
pnpm i
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Run E2E Tests with [Cypress](https://www.cypress.io/)

```sh
# In web directory
pnpm dev-e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### Directory and file structure

```
.
├── README.md
├── node_modules
├── package.json
├── packages    // Isolated minsweeper package without UI related codes.
│   └── minesweeper
│       ├── dist
│       ├── node_modules
│       ├── package.json
│       ├── rollup.config.js
│       ├── src
│       └── tsconfig.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── web
    ├── cypress    // E2E testing dir.
    │   ├── downloads   // Any files downloaded while testing an application 
    │   ├── fixtures    // External pieces of static data that can be used by tests
    │   ├── integration     // Primary test files. *.spec.js
    │   ├── plugins     // Special files that execute in Node before the project is loaded, before the browser launches, and during your test execution.
    │   ├── screenshots     // Screenshots taken via the cy.screenshot() command
    │   └── support    // To include code before testing
    ├── cypress.json     // Cypress config file
    ├── index.html
    ├── node_modules
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.vue
    │   ├── components
    │   ├── env.d.ts
    │   ├── index.css
    │   ├── main.ts
    │   └── utils
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── vue.config.js

```
