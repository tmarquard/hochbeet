# hochbeet — React Skeleton Design

**Date:** 2026-05-27  
**Status:** Approved

## Overview

Scaffold a minimal Vite + React + TypeScript skeleton in `/Users/thorsten/Repositories/hochbeet`, run it locally to verify, then push to a new GitHub repository named `hochbeet` on a single `main` branch.

## Stack

| Concern | Choice |
|---------|--------|
| Scaffolding | Vite `react-ts` template |
| Language | TypeScript |
| Dev server | `http://localhost:5173` (Vite default) |
| Package manager | npm |

## File Structure

```
hochbeet/
├── public/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

No additional dependencies beyond the Vite `react-ts` template defaults.

## GitHub Setup

- Repo name: `hochbeet`
- Default branch: `main`
- Single initial commit containing the full scaffold
- Visibility: public (default; confirm before creation)

## Steps

1. Scaffold with `npm create vite@latest . -- --template react-ts`
2. `npm install`
3. `npm run dev` — verify app loads at `localhost:5173`
4. `git init && git add . && git commit`
5. `gh repo create hochbeet --public --source=. --remote=origin --push`
