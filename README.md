[![CI](https://github.com/michal-weglarz/platzi-fake-store/actions/workflows/ci.yml/badge.svg)](https://github.com/michal-weglarz/platzi-fake-store/actions/workflows/ci.yml)

# Platzi Fake Store

E-commerce application built with React, TypeScript, and Vite, consuming the Platzi Fake Store API.

![Screenshot 2025-11-03 at 14.03.53.png](public/Screenshot%202025-11-03%20at%2014.03.53.png)

## Live preview

- https://platzi-fake-store.michalweglarz.com

## Access

All users can view products by entering these urls:

- `/products`
- `/products/:id`

Only authenticated users can access:

- `/products/new`
- `/products/:id/edit`
- Delete action

## Tech Stack

- React 18
- TypeScript
- Wouter
- Tanstack Query
- DaisyUI + TailwindCSS
- Vite, Vitest
- ESLint, Prettier
- [Platzi Fake Store API](https://fakeapi.platzi.com/)

## Prerequisites

- Node.js (version 20.x or higher)
- npm

## Installation

```bash
git clone https://github.com/michal-weglarz/platzi-fake-store.git
cd platzi-fake-store
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Project Structure

```
platzi-fake-store/
├── src/
│   ├── shared/         # Reusable components
│   ├── features/       # Main feature groups
│   ├── utils/          # Utility functions
│   ├── types.ts        # TypeScript types
│   ├── index.css        
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .prettierrc
└── eslint.config.js
```

## Build

```bash
npm run build
```

Production files are generated in the `dist` directory.