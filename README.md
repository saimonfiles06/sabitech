# SABITECH WEB

Aplicación web para gestionar las reservas y la asistencia a las jornadas de charlas **SABITECH**, organizadas por XTART.

> **Estado del proyecto:** en desarrollo. Este README se actualiza según avanzamos. Lo marcado como _pendiente_ todavía no está implementado.

- **Curso:** 2.º de Desarrollo de Aplicaciones Web (DAW), trabajo de tres personas.
- **Tipo de trabajo:** proyecto intermodular.
- **Entregas:** checkpoint del 23 al 30 de noviembre de 2026 · entrega final con defensa del 22 al 26 de febrero de 2027.

---

## 1. ¿Qué hace la aplicación?

| Funcionalidad | Estado |
| --- | --- |
| Consultar el catálogo de charlas (título, rama, ponente, sala y horario) | Hecho |
| Registrarse, iniciar sesión y cerrar sesión (token con caducidad de 6 horas) | Hecho |
| Reservar plaza en una charla, con control de aforo, de reservas duplicadas y de peticiones simultáneas | Hecho |
| Ver en el perfil las charlas reservadas | Hecho |
| Detalle completo de cada charla | _Pendiente_ |
| Cancelar una reserva | _Pendiente_ |
| Correo de confirmación por cada reserva | _Pendiente_ |
| Registro de asistencia con un código QR que cambia cada 30 segundos, validado por el servidor | _Pendiente_ |
| Panel de administración (charlas, usuarios y asistentes) | _Pendiente_ |

## 2. Tecnologías

| Parte | Tecnología |
| --- | --- |
| Frontend | React 19 + Vite + React Router (JavaScript) |
| Backend | PHP 8.4 + Laravel 13 (API REST) |
| Autenticación | Laravel Sanctum (tokens) |
| Base de datos | MySQL 8.4 |
| Entorno | Docker Compose (tres contenedores) |

## 3. Estructura del repositorio

```
sabitech/
├── backend/
│   ├── compose.yaml        # Arranca los tres contenedores
│   ├── Dockerfile          # Imagen del backend (Apache + PHP + Composer)
│   ├── docker/apache/      # Configuración de Apache
│   └── app/                # Proyecto Laravel
├── frontend/
│   ├── Dockerfile          # Imagen del frontend (Node + Vite)
│   └── src/                # Proyecto React
└── Sabitech docs/          # Documentación del equipo (pasos, reuniones, diagrama E-R…)
```

## 4. Contenedores

Todos se arrancan desde la carpeta `backend` con un solo `docker compose`.

| Contenedor | Servicio en `compose.yaml` | Qué es | Dirección |
| --- | --- | --- | --- |
| `backend` | `web` | Laravel con Apache y PHP | <http://localhost:8080> |
| `bbdd` | `db` | MySQL 8.4 (datos guardados en el volumen `mysql_data`) | Solo accesible entre contenedores |
| `frontend` | `frontend` | React con Vite. Reenvía las peticiones `/api` al backend | <http://localhost:5173> |

## 5. Puesta en marcha (desarrollo)

### Requisitos

- Docker Desktop instalado y abierto.
- Git.

No hace falta tener PHP, Composer ni Node instalados en el ordenador: todo funciona dentro de los contenedores.

### Primera vez (desde cero)

Todos los comandos se ejecutan **desde la carpeta `backend`**.

1. **Clonar el repositorio** y entrar en la carpeta del backend:
   ```bash
   git clone https://github.com/saimonfiles06/sabitech.git
   cd sabitech/backend
   ```

2. **Crear el fichero de configuración** de Laravel a partir del ejemplo. El fichero `.env` no se sube nunca al repositorio:
   ```bash
   cp app/.env.example app/.env
   ```
   Los valores ya están preparados para Docker. `APP_KEY` se rellena sola en el paso 5.

   `DB_HOST=db` es el nombre del servicio de MySQL en `compose.yaml`: los contenedores se encuentran entre sí por ese nombre.

3. **Construir y arrancar los contenedores:**
   ```bash
   docker compose up -d --build
   ```
   La primera vez tarda unos minutos. El frontend instala sus dependencias solo al arrancar.

4. **Instalar las dependencias de Laravel** (la carpeta `vendor` no está en el repositorio):
   ```bash
   docker compose exec web composer install
   ```

5. **Generar la clave de la aplicación** (rellena `APP_KEY` en el `.env`):
   ```bash
   docker compose exec web php artisan key:generate
   ```

6. **Crear las tablas y cargar los datos de prueba:**
   ```bash
   docker compose exec web php artisan migrate:fresh --seed
   ```
   Crea usuarios de prueba de todos los roles, 5 salas y 10 charlas. `migrate:fresh` **borra todas las tablas** antes de crearlas, así que solo debe usarse en desarrollo.

7. **Abrir la aplicación** en el navegador: <http://localhost:5173>

### Arranque diario

Con Docker Desktop abierto, desde `backend`:
```bash
docker compose up -d
```
y abrir <http://localhost:5173>. Para pararlo al terminar: `docker compose stop`.

### Después de actualizar el repositorio (`git pull`)

Según lo que haya cambiado, desde `backend`:

| Si ha cambiado… | Ejecutar |
| --- | --- |
| `composer.json` (dependencias de Laravel) | `docker compose exec web composer install` |
| Hay migraciones nuevas | `docker compose exec web php artisan migrate` |
| Los seeders o la estructura de las tablas (y no importa perder los datos) | `docker compose exec web php artisan migrate:fresh --seed` |
| `package.json` (dependencias de React) | `docker compose restart frontend` |
| Un `Dockerfile` o `compose.yaml` | `docker compose up -d --build` |

### Cuentas de prueba

Todas usan la contraseña `password`.

| Correo | Rol |
| --- | --- |
| `admin@correo.es` | administrador |
| `ponente@correo.es` | ponente |
| `usuario@correo.es` | usuario |
| `supervisor1@correo.es` | supervisor |

### Ver la aplicación desde el móvil

1. Conecta el ordenador y el móvil a la misma wifi. Las redes de invitados o de centros educativos suelen aislar los dispositivos entre sí.
2. Abre el puerto del frontend a la red:
   ```bash
   IP_FRONTEND=0.0.0.0 docker compose up -d frontend
   ```
3. Averigua la IP del ordenador (en Mac: `ipconfig getifaddr en0`; en Windows: `ipconfig`).
4. En el móvil, entra en `http://IP_DEL_ORDENADOR:5173`.


### Comandos útiles

```bash
docker compose ps                                  # Ver qué contenedores están activos
docker compose logs -f web                         # Ver los mensajes del backend (o frontend, db)
docker compose restart frontend                    # Reiniciar el frontend si no se ven los cambios
docker compose stop                                # Parar los contenedores (sin borrarlos)
docker compose down                                # Parar y eliminar los contenedores (los datos de MySQL se conservan)
docker compose exec web php artisan route:list --path=api   # Ver las rutas de la API
```

## 6. API

Todas las rutas empiezan por `/api`. Las protegidas exigen la cabecera `Authorization: Bearer <token>`. Sin un token válido, responden `401`.

| Método | Ruta | Protegida | Qué hace |
| --- | --- | --- | --- |
| GET | `/api/charlas` | No | Catálogo de charlas activas, ordenadas por fecha |
| POST | `/api/registro` | No (máx. 10 por minuto) | Crea una cuenta con rol `usuario` y devuelve un token |
| POST | `/api/login` | No (máx. 10 por minuto) | Inicia sesión y devuelve un token |
| POST | `/api/logout` | Sí | Cierra la sesión (invalida el token) |
| GET | `/api/usuarios` | Sí | Listado de usuarios (solo administrador) |
| GET | `/api/usuarios/{id}` | Sí | Datos de un usuario |
| GET | `/api/reservas` | Sí | Listado de todas las reservas |
| GET | `/api/usuarios/{id}/reservas` | Sí | Charlas con reserva confirmada de un usuario (el propio usuario o un administrador) |
| POST | `/api/reservas` | Sí | Reserva una plaza: `{ "charla_id": 3 }`. Responde `201`, `409` (ya reservada o sin plazas) o `422` (charla no válida, no activa o ya empezada) |

## 7. Planificación

| Hito | Fechas |
| --- | --- |
| Checkpoint (avance de todos los módulos) | 23–30 de noviembre de 2026 |
| Entrega final y defensa | 22–26 de febrero de 2027 |

## 8. Equipo

| Integrante |
| --- |
| Joan Simon Blanch |
| Alejandro Rosell Segarra |
| David Martin Romero |
