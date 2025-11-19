# Chat App - Real-time Collaborative Chat

Una aplicación de chat en tiempo real construida con React, Express, Socket.io y Supabase, organizada como monorepo.

## Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia los archivos `.env.example` y configúralos:

```bash
# Servidor
cp apps/server/.env.example apps/server/.env

# Web
cp apps/web/.env.example apps/web/.env
```

Edita los archivos `.env` con tus credenciales de Supabase.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Esto iniciará:

- **Server**: http://localhost:3000
- **Web**: http://localhost:5173

## Project Structure

```
chat-monorepo/
├── apps/
│   ├── web/              # React + Vite + TailwindCSS
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── auth/    # Autenticación
│   │   │   │   └── chat/    # Chat en tiempo real
│   │   │   ├── config/      # Configuración
│   │   │   └── lib/         # Utilidades
│   │   └── package.json
│   └── server/           # Express + Socket.io
│       ├── src/
│       │   ├── config/      # Database, WebSocket
│       │   ├── handlers/    # WebSocket handlers
│       │   ├── middleware/  # Auth, Error handling
│       │   ├── routes/      # API routes
│       │   ├── services/    # Business logic
│       │   └── utils/       # Logger, helpers
│       └── package.json
├── packages/
│   └── shared/           # Código compartido
│       ├── src/
│       │   ├── constants.js
│       │   ├── validators.js
│       │   └── utils.js
│       └── package.json
├── package.json          # Monorepo config
├── turbo.json            # Turborepo config
└── README.md
```

## Comandos Disponibles

```bash
# Desarrollo (server + web en paralelo)
npm run dev

# Solo servidor
npm run dev:server

# Solo web
npm run dev:web

# Build de producción
npm run build

# Verificar configuración
npm run verify

# Limpiar dependencias
npm run clean

# Linting
npm run lint
```

## Features

- **Autenticación**: Login con Supabase Auth
- **Chat en tiempo real**: WebSocket con Socket.io
- **Salas múltiples**: Crea y únete a diferentes salas
- **Lista de usuarios**: Ve quién está online
- **UI moderna**: TailwindCSS v4
- **Monorepo**: Turborepo para gestión eficiente
- **Seguridad**: Row Level Security (RLS) en Supabase
- **Responsive**: Diseño adaptable

## Stack Tecnológico

### Frontend

- **React 19** - UI Library
- **Vite** - Build tool
- **TailwindCSS v4** - Styling
- **Socket.io Client** - WebSocket
- **Supabase Client** - Database & Auth
- **React Router** - Routing

### Backend

- **Express** - Web framework
- **Socket.io** - WebSocket server
- **Supabase** - PostgreSQL + Auth + Realtime
- **JWT** - Token authentication
- **dotenv** - Environment variables

### Infraestructura

- **Turborepo** - Monorepo management
- **npm workspaces** - Package management
- **Supabase** - Backend as a Service

## Documentación
- [API Documentation](#) - Próximamente

## Troubleshooting

Ver [SETUP.md](./SETUP.md#troubleshooting) para soluciones comunes.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

MIT

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
