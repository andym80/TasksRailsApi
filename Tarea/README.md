# Aplicación de Gestión de Tareas - Tasks Rail API

Una aplicación full-stack con API de Rails y frontend de Next.js para gestionar tareas y proyectos.

---

## 🇪🇸 Versión en Español

### Requisitos Previos

- Docker y Docker Compose instalados en tu sistema
- Git (para clonar el repositorio)

### Estructura del Proyecto

- `backend/` - API de Rails (se ejecuta en el puerto 3001)
- `frontend/` - Aplicación Next.js (se ejecuta en el puerto 3000)
- `docker-compose.yml` - Define los servicios (PostgreSQL, Rails, Next.js)

### Primeros Pasos

#### 1. Configuración del Entorno

Crea un archivo `.env` en el directorio `Tarea/` con las variables de entorno necesarias:

```bash
# .env
DATABASE_URL=postgresql://postgres:password@db:5432/taskmanager_development
RAILS_ENV=development
SECRET_KEY_BASE=supersecretkey123
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 2. Construir y Ejecutar con Docker Compose

Navega al directorio `Tarea/` e inicia todos los servicios:

```bash
cd Tarea
docker-compose up --build
```

Esto hará lo siguiente:
- Inicia una base de datos PostgreSQL (puerto 5432)
- Construye e inicia el backend de Rails (puerto 3001)
- Construye e inicia el frontend de Next.js (puerto 3000)

#### 3. Inicializar la Base de Datos

En una nueva terminal, ejecuta las migraciones de la base de datos:

```bash
docker-compose exec backend rails db:create db:migrate
```

(Opcional) Llena la base de datos con datos de ejemplo:

```bash
docker-compose exec backend rails db:seed
```

#### 4. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:3001
- **Base de Datos**: localhost:5432 (PostgreSQL)

### Ejecutar sin Docker

#### Backend (Rails)

```bash
cd Tarea/backend
bundle install
rails db:create db:migrate
rails s -b 0.0.0.0 -p 3001
```

#### Frontend (Next.js)

```bash
cd Tarea/frontend
npm install
npm run dev
```

### Scripts Disponibles

#### Backend

- `rails db:create` - Crear la base de datos
- `rails db:migrate` - Ejecutar migraciones
- `rails db:seed` - Poblar datos de ejemplo
- `rails s` - Iniciar el servidor de Rails
- `rails test` - Ejecutar pruebas

#### Frontend

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm start` - Iniciar servidor de producción

### Detener Servicios

Para detener los servicios de Docker:

```bash
docker-compose down
```

Para detener y eliminar volúmenes (ADVERTENCIA: elimina la base de datos):

```bash
docker-compose down -v
```

### Pruebas

#### Pruebas del Backend

```bash
docker-compose exec backend rails test
```

#### Pruebas del Frontend

```bash
docker-compose exec frontend npm test
```

### Configuración Adicional

#### Variables de Entorno

El backend lee variables de entorno de:
1. Archivo `.env` en el directorio `Tarea/`
2. Configuraciones de entorno en `config/environments/`

#### Base de Datos

- Usuario predeterminado de PostgreSQL: `postgres`
- Contraseña predeterminada: `password`
- Nombre de la base de datos: `taskmanager_development`

#### Configuración CORS

CORS se configura en `backend/config/initializers/cors.rb` para permitir solicitudes desde el frontend.

### Solución de Problemas

**¿Puerto ya en uso?**
- Cambia los puertos en `docker-compose.yml` o detén otros servicios que utilicen esos puertos

**¿Error de conexión a la base de datos?**
- Asegúrate de que el contenedor de PostgreSQL se está ejecutando: `docker-compose logs db`
- Verifica que los valores en `.env` coincidan con `docker-compose.yml`

**¿No puedes conectarte al backend desde el frontend?**
- Asegúrate de que los servicios estén en la misma red de Docker
- Verifica que el nombre del servicio `backend` se use en las llamadas API del frontend

### Desarrollo

Para obtener información detallada sobre servicios específicos:
- Backend: Ver `backend/README.md`
- Frontend: Ver `frontend/README.md`

---

## 🇬🇧 English Version

# Tasks Rail API

A full-stack Rails API with Next.js frontend application for managing tasks and projects.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (for cloning the repository)

## Project Structure

- `backend/` - Rails API (runs on port 3001)
- `frontend/` - Next.js application (runs on port 3000)
- `docker-compose.yml` - Defines the services (PostgreSQL, Rails, Next.js)

## Getting Started

### 1. Environment Setup

Create a `.env` file in the `Tarea/` directory with the necessary environment variables:

```bash
# .env
DATABASE_URL=postgresql://postgres:password@db:5432/taskmanager_development
RAILS_ENV=development
SECRET_KEY_BASE=supersecretkey123
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Build and Run with Docker Compose

Navigate to the `Tarea/` directory and start all services:

```bash
cd Tarea
docker-compose up --build
```

This will:
- Start a PostgreSQL database (port 5432)
- Build and start the Rails backend (port 3001)
- Build and start the Next.js frontend (port 3000)

### 3. Initialize the Database

In a new terminal, run database migrations:

```bash
docker-compose exec backend rails db:create db:migrate
```

(Optional) Seed the database with sample data:

```bash
docker-compose exec backend rails db:seed
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432 (PostgreSQL)

## Running Without Docker

### Backend (Rails)

```bash
cd Tarea/backend
bundle install
rails db:create db:migrate
rails s -b 0.0.0.0 -p 3001
```

### Frontend (Next.js)

```bash
cd Tarea/frontend
npm install
npm run dev
```

## Available Scripts

### Backend

- `rails db:create` - Create the database
- `rails db:migrate` - Run migrations
- `rails db:seed` - Populate sample data
- `rails s` - Start the Rails server
- `rails test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Stopping Services

To stop the Docker services:

```bash
docker-compose down
```

To stop and remove volumes (WARNING: deletes database):

```bash
docker-compose down -v
```

## Testing

### Backend Tests

```bash
docker-compose exec backend rails test
```

### Frontend Tests

```bash
docker-compose exec frontend npm test
```

## Additional Configuration

### Environment Variables

The backend reads environment variables from:
1. `.env` file in the `Tarea/` directory
2. Environment configurations in `config/environments/`

### Database

- Default PostgreSQL user: `postgres`
- Default password: `password`
- Database name: `taskmanager_development`

### CORS Configuration

CORS is configured in `backend/config/initializers/cors.rb` to allow requests from the frontend.

## Troubleshooting

**Port already in use?**
- Change the ports in `docker-compose.yml` or stop other services using those ports

**Database connection error?**
- Ensure PostgreSQL container is running: `docker-compose logs db`
- Check `.env` file values match `docker-compose.yml`

**Cannot connect to backend from frontend?**
- Ensure services are on the same Docker network
- Check `backend` service name is used in frontend API calls

## Development

For detailed information about specific services:
- Backend: See `backend/README.md`
- Frontend: See `frontend/README.md`
