# 🧶 LadyNails - Backend API

![Medusa](https://img.shields.io/badge/v2.0-MedusaJS-blueviolet?style=for-the-badge&logo=medusa)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

Bienvenido al motor de comercio electrónico de **NariñoTex**, construido sobre la potente arquitectura de **MedusaJS v2**. Este backend gestiona la lógica de negocio, productos, pedidos, autenticación y flujos de trabajo personalizados para la plataforma.

---

## 🚀 Características Principales

- **Arquitectura Modular:** Basada en Medusa 2.0 para una máxima flexibilidad.
- **Flujos de Trabajo (Workflows):** Automatización de procesos de negocio complejos.
- **Sistema de Suscriptores:** Manejo de eventos asíncronos para integraciones (ej. correos, inventario).
- **Notificaciones Avanzadas:** Integración con **Resend** para comunicaciones con el cliente.
- **Admin Dashboard:** Panel de administración personalizado para la gestión de la tienda.

## 🛠️ Stack Tecnológico

- **Core:** [MedusaJS v2](https://docs.medusajs.com/)
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL
- **Caché/Eventos:** Redis
- **Emails:** Resend
- **Gestor de Paquetes:** pnpm

---

## ⚙️ Configuración del Proyecto

### 1. Requisitos Previos

- **Node.js:** v20 o superior.
- **PostgreSQL:** Una instancia activa.
- **Redis:** Requerido para tareas en segundo plano y caché.
- **pnpm:** Instalado globalmente (`npm install -g pnpm`).

### 2. Instalación

Clona el repositorio y ejecuta:

```bash
pnpm install
```

### 3. Variables de Entorno

Copia el archivo de plantilla y configura tus credenciales:

```bash
cp .env.template .env
```

Asegúrate de configurar:
- `DATABASE_URL`: Conexión a tu base de datos PostgreSQL.
- `REDIS_URL`: Conexión a tu instancia de Redis.
- `RESEND_API_KEY`: Para el envío de correos.

### 4. Inicialización de la Base de Datos

Ejecuta las migraciones y carga los datos iniciales:

```bash
# Ejecutar migraciones
npx medusa db:migrate

# Cargar datos de prueba (opcional)
pnpm run seed
```

---

## 🧑‍💻 Desarrollo

Para iniciar el servidor en modo desarrollo con hot-reload:

```bash
pnpm run dev
```

El servidor estará disponible en `http://localhost:9000`.

### Scripts Disponibles

- `pnpm run build`: Compila el proyecto para producción.
- `pnpm run start`: Inicia el servidor compilado.
- `pnpm run test:unit`: Ejecuta las pruebas unitarias.
- `pnpm run test:integration:http`: Ejecuta pruebas de integración de API.

---

## 📂 Estructura del Directorio

- `/src/admin`: Extensiones y personalizaciones del panel de administración.
- `/src/api`: Endpoints personalizados de la API.
- `/src/modules`: Módulos de comercio personalizados.
- `/src/subscribers`: Manejadores de eventos (side effects).
- `/src/workflows`: Definiciones de orquestación de procesos.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

<p align="center">
  Hecho con ❤️ para LadyNails
</p>
