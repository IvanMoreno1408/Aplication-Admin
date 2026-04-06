# Application Admins

Panel administrativo web para autenticación y gestión de productos.

## Tecnologías

- React 18
- TypeScript
- Vite 6
- React Router DOM
- Axios
- Tailwind CSS

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación y ejecución

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno en `.env`:

```env
VITE_API_URL=/proxy-productos
VITE_USERS_API_URL=/proxy-usuarios
```

3. Ejecutar en desarrollo:

```bash
npm run dev
```

La aplicación quedará disponible normalmente en `http://localhost:5173`.

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo con Vite.
- `npm run build`: compila TypeScript y genera el build de producción.
- `npm run lint`: ejecuta el linter del proyecto.
- `npm run preview`: levanta una vista previa del build de producción.

## Funcionalidades principales

- Inicio de sesión de administradores.
- Rutas protegidas con redirección a `/login` si el token expira o no existe.
- Dashboard con métricas básicas.
- CRUD de productos:
  - listar
  - crear
  - editar
  - eliminar
- Subida de imágenes mediante ImgBB.

## Estructura del proyecto (guiada)

```text
application-admins/
├── public/                                      # Archivos estáticos públicos
│
├── src/
│   ├── main.tsx                                 # Punto de entrada de React
│   ├── App.tsx                                  # Componente raíz
│   ├── index.css                                # Estilos globales
│   ├── vite-env.d.ts                            # Tipos de Vite
│   │
│   ├── components/
│   │   ├── atoms/                               # Componentes base reutilizables
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Spinner.tsx
│   │   │
│   │   ├── molecules/                           # Composición de átomos
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── ToastItem.tsx
│   │   │
│   │   └── organisms/                           # Componentes de mayor complejidad
│   │       ├── Header.tsx
│   │       ├── MetricCard.tsx
│   │       ├── ProductForm.tsx
│   │       ├── ProductsTable.tsx
│   │       ├── Sidebar.tsx
│   │       └── ToastNotification.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx                      # Estado global de autenticación
│   │   ├── ProductContext.tsx                   # Estado global de productos
│   │   └── UIContext.tsx                        # Estado global de UI (toasts, etc.)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                           # Hook para auth
│   │   └── useProducts.ts                       # Hook para productos
│   │
│   ├── layouts/
│   │   └── DashboardLayout.tsx                  # Layout protegido del dashboard
│   │
│   ├── models/
│   │   ├── AuthResponse.ts                      # Tipos de respuesta de login
│   │   ├── Product.ts                           # Tipos de producto y DTOs
│   │   └── User.ts                              # Tipo de usuario
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx                    # Vista principal del dashboard
│   │   ├── LoginPage.tsx                        # Vista de inicio de sesión
│   │   └── ProductsPage.tsx                     # Vista de administración de productos
│   │
│   ├── routes/
│   │   ├── AppRouter.tsx                        # Definición central de rutas
│   │   └── PrivateRoute.tsx                     # Guarda de rutas privadas
│   │
│   ├── services/
│   │   ├── authService.ts                       # Consumo de API de autenticación
│   │   ├── imgbbService.ts                      # Subida de imágenes a ImgBB
│   │   └── productService.ts                    # CRUD de productos
│   │
│   └── utils/
│       └── httpClient.ts                        # Clientes Axios e interceptores
│
├── .env                                          # Variables de entorno
├── index.html                                    # Plantilla HTML base
├── package.json                                  # Dependencias y scripts
├── tsconfig.json                                 # Configuración de TypeScript
├── vite.config.ts                                # Configuración de Vite y proxy
└── README.md                                     # Documentación del proyecto
```

## APIs y proxy (desarrollo)

El proyecto usa proxy en `vite.config.ts` para evitar problemas de CORS en local:

- `/proxy-productos` -> API de productos (Azure)
- `/proxy-usuarios` -> API de usuarios/auth (Azure)

## Autenticación

- El token se guarda en `localStorage` con la llave `token`.
- Se adjunta automáticamente en `Authorization: Bearer <token>` para cada request.
- Ante respuestas `401`, se limpia el token y se redirige al login.

## Notas

- Actualmente la llave de ImgBB está definida de forma fija en `src/services/imgbbService.ts`.
- Recomendación: mover esa llave a una variable de entorno (por ejemplo `VITE_IMGBB_API_KEY`) para mejorar seguridad y mantenimiento.
