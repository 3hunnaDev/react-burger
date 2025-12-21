# React Burger

React Burger is a single-page application for assembling custom burgers, placing orders, and tracking activity in a personal account. The interface focuses on a smooth builder experience: users browse ingredients, assemble a burger with drag-and-drop, review composition details, and submit orders. Authentication unlocks profile features, while a WebSocket feed keeps order updates live and responsive.

## Table of Contents

- [Demo](#demo)
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deployment](#deployment)

## Demo

Live site: https://3hunnadev.github.io/react-burger/

## Overview

The project emphasizes clean UX and predictable state management. Core flows are implemented as modular pages with shared UI components, while Redux Toolkit manages global state for the constructor, orders, and authentication. Testing covers both unit-level logic and end-to-end scenarios.

## Features

- Drag-and-drop burger constructor
- Ingredient details and order composition
- Authentication and profile management
- Order history and live feed via WebSocket
- Responsive UI

## Tech Stack

- React + TypeScript
- Redux Toolkit
- React Router
- WebSocket
- Cypress and Jest (react-scripts)

## Project Structure

- `src/components` — reusable UI and layout components
- `src/pages` — application pages and flows
- `src/store` — Redux Toolkit slices, actions, and thunks
- `src/api` — API layer for backend communication
- `cypress` — end-to-end tests and support utilities

## Getting Started

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Scripts

```bash
npm start        # run dev server
npm test         # run unit tests in watch mode
npm run build    # create production build
npm run test:all # run unit tests once and then Cypress
npm run test:cypress
```

## Testing

- Unit tests (watch mode): `npm test`
- Full CI run: `npm run test:all` (runs tests once, then Cypress)
- E2E tests only: `npm run test:cypress`

## Deployment

GitHub Pages: https://3hunnadev.github.io/react-burger/
