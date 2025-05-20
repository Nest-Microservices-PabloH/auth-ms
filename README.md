<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" 
  width="120" alt="Nest Logo" /></a>
</p>

# Microservicio de Autenticación

## Descripción
Este microservicio maneja la autenticación y autorización de usuarios en el sistema. Proporciona endpoints para el registro, inicio de sesión y gestión de tokens JWT.

## Tecnologías
- NestJS
- TypeScript
- JWT (JSON Web Tokens)
- Passport.js
- MongoDB

## Requisitos Previos
- Node.js (v16 o superior)
- MongoDB
- pnpm (gestor de paquetes)

## Instalación

```bash
# Instalar pnpm globalmente (si no está instalado)
$ npm install -g pnpm

# Instalar dependencias
$ pnpm install

# Configurar variables de entorno
$ cp .env.template .env
```

## Variables de Entorno
Generar una copia del archivo `.env.template` y configurar las variables solicitadas según el entorno de desarrollo.

## Ejecución

```bash
# Desarrollo
$ pnpm start

# Modo observador
$ pnpm start:dev

# Producción
$ pnpm start:prod
```

## Endpoints

### Autenticación
- `POST /auth/register` - Registro de nuevos usuarios
- `POST /auth/login` - Inicio de sesión
- `GET /auth/verify` - Obtener perfil del usuario

## Estructura del Proyecto
```
src/
├── auth/           # Módulo de autenticación
├── users/          # Módulo de usuarios
├── common/         # Utilidades comunes
└── main.ts         # Punto de entrada
```