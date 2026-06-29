# ⚔️ TaskMaster JRPG

SPA de gestión de tareas con temática de videojuegos de rol japoneses (JRPG).  
Desarrollada con React 18 + Bootstrap 5 para la Evaluación Sumativa 3 — Ingeniería en Informática.

## 🎮 Demo en vivo

[Ver en GitHub Pages](./docs/index.html)

## 🛠️ Stack tecnológico

- React 18 (useState, useEffect, useCallback, useMemo)
- Bootstrap 5 + Bootstrap Icons
- CSS Variables (tema oscuro estilo JRPG)
- JSONPlaceholder API (fetch con AbortController)
- localStorage para persistencia
- GitHub Pages (carpeta `docs/`)

## ✨ Funcionalidades

- CRUD completo de misiones/tareas
- Sistema de prioridades (Alta / Media / Baja)
- Barra de progreso de aventura
- Búsqueda, filtros y ordenamiento
- Vista de Posts desde API externa
- Toasts de notificación
- Diseño responsive mobile-first

## 🚀 Instalar y ejecutar

```bash
npm install
npm start
```

## 📦 Build y deploy a GitHub Pages

```bash
npm run build
npm run deploy
# Luego configura GitHub Pages → Branch: main → Folder: /docs
```

## 📁 Estructura

```
taskmaster-jrpg/
├── docs/          ← Build de producción (GitHub Pages)
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── StatsBar.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskCard.jsx
│   │   ├── PostsView.jsx
│   │   └── Toast.jsx
│   ├── App.jsx
│   ├── index.css
│   └── index.js
├── .gitignore
├── .nojekyll
├── package.json
└── README.md
```

## 🤖 Uso de IA

Prompts documentados en `PROMPTS.md`.
