# Let Me Ask (Client)

A front-end application built with React, Vite, TypeScript, and Tailwind CSS.

## Main Technologies

- **React 19** — Library for building user interfaces.
- **Vite** — Fast and modern build tool.
- **TypeScript** — Static typing for JavaScript.
- **Tailwind CSS** — Utility-first CSS framework.
- **React Router DOM** — SPA routing.
- **React Query** — Async data management.
- **Radix UI, Lucide React, clsx, class-variance-authority** — Component utilities and icons.

## Project Patterns

- **Componentization**: Functional component structure.
- **Hooks**: State and side-effect management.
- **Provider Pattern**: Global contexts for React Query and routing.
- **Import Alias**: `@/` points to `src/`.

## Setup & Usage

### Prerequisites

- Node.js 18+
- npm 9+ (or pnpm/yarn)

### Installation

```bash
npm install
# or
yarn
# or
pnpm install
```

### Development

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Configuration

- **TypeScript**: See `tsconfig.json` and `tsconfig.app.json` for strict settings and path aliases.
- **Vite**: Configured in `vite.config.ts` (includes React and Tailwind plugins).
- **Tailwind CSS**: Directives imported in `src/index.css`. (Create `tailwind.config.js` for advanced customization if needed.)
- **Alias**: Use `@/` to import from `src`.

## Useful Scripts

- `dev`: Start development server.
- `build`: Build for production.
- `preview`: Preview the production build locally.
