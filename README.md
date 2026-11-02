# SABITECH WEB

Aplicación web para gestionar las reservas y la asistencia a las jornadas de charlas **SABITECH**.

> **Estado del proyecto:** en desarrollo (versión inicial). Este README se irá actualizando según avancemos. Lo marcado como _pendiente_ todavía no está decidido o implementado.

- **Curso:** 2.º de Desarrollo de Aplicaciones Web (DAW), trabajo de tres personas.
- **Tipo de trabajo:** proyecto intermodular
- **Entregas:** checkpoint del 23 al 30 de noviembre de 2026 · entrega final con defensa del 22 al 26 de febrero de 2027

---

## 1. ¿Qué hace la aplicación?

- Consultar el programa de charlas y ver el detalle de cada una (título, contenido, ponente, fecha, horario, ubicación y aforo).
- Registrarse, identificarse y **reservar plaza** en una charla con plazas disponibles.
- Consultar y **cancelar** las propias reservas.
- Recibir un **correo de confirmación** por cada reserva.
- Registrar la **asistencia** mediante un **código QR que cambia cada 30 segundos**, validado siempre por el servidor.
- Panel de administración para gestionar charlas y usuarios, y ver y editar los asistentes.

## 2. Tecnologías

| Parte         | Tecnología                          |
| ------------- | ----------------------------------- |
| Frontend      | JavaScript + React                  |
| Backend       | PHP + Laravel (API)                 |
| Base de datos | MySQL 8.4                           |
| Entorno       | Docker (contenedores de desarrollo) |

## 3. Puesta en marcha (desarrollo)

### Requisitos

- Docker Desktop instalado y abierto
- Git

### Contenedores

Los contenedores e imágenes tienen nombres fijos y descriptivos:

| Nombre               | Qué es                                                    |
| -------------------- | --------------------------------------------------------- |
| `sabitech-web`       | Imagen y contenedor del backend (Apache + PHP + Composer) |
| `sabitech-basedatos` | Contenedor de MySQL                                       |
| _(frontend)_         | _pendiente de crear_                                      |

### Pasos

1. Clonar el repositorio y entrar en la carpeta del proyecto.
2. Crear el archivo de configuración a partir del ejemplo (**nunca subir contraseñas reales**):
   ```bash
   cp app/.env.example app/.env
   ```
3. Construir y arrancar los contenedores:
   ```bash
   docker compose up -d --build
   ```
4. Abrir en el navegador: <http://localhost:8080>

### Comandos útiles

```bash
docker compose ps          # Ver qué contenedores están activos
docker compose logs -f     # Ver los mensajes de los contenedores
docker compose stop        # Parar los contenedores (sin borrarlos)
docker compose down        # Parar y eliminar los contenedores (los datos de MySQL se conservan en su volumen)
```

## 4. Planificación

| Hito                                     | Fechas                     |
| ---------------------------------------- | -------------------------- |
| Checkpoint (avance de todos los módulos) | 23–30 de noviembre de 2026 |
| Entrega final y defensa                  | 22–26 de febrero de 2027   |

## 5. Equipo

| Integrante                 |
| -------------------------- |
| _Joan Simon Blanch_        |
| _Alejandro Rosell Segarra_ |
| _David Martin Romero_      |
