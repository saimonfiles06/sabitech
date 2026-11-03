# Diseños pantallas 28/10/2026

==Se decide centrarse para el checkpoint en el diseño de ordenador==

# Pantalla principal

Header
Logo y botón login
h2 con "Catálogo charlas"
Main
Filtro selección rama (desplegable con sanidad, business y tech) // Se añadirá posteriormente
Carousel resumen charlas
Cabecera con rama estudios, título charla y fecha+hora. Si usuario es admin, botón editar charla.
Cuerpo con imagen relacionada, ponente y resumen descripción charla.
Footer con botón +info, plazas disponibles y botón reserva.
Footer
Información variada

# Formularios

## Login

1. Correo
2. Contraseña
3. Recuperar contraseña
4. Enlace a registro (crear cuenta)
5. Botón iniciar sesión

## Registro

1. Nombre
2. Apellidos
3. Correo
4. Contraseña
5. Confirmar contraseña
6. Botón registrarse

## Administración charlas

Header
Logo a izquierda, centro "Administración charlas", derecha botón opciones usuario (decidir que incluir)
Main
Filtros buscar charla desplegable filtro por rama y text para buscar por título o ponente
Listado charlas con CRUD
Mostrar ficha
Footer con información variada

## Administración usuarios

Header
Logo a izquierda, centro "Administración usuarios", derecha botón opciones usuario (decidir que incluir)
Main
Filtros buscar usuario mediante correo (con un text) o con number para el id
Listado usuarios con CRUD
Footer
Información variada

## Recuperación contraseña -- Funcionalidad y diseño para más tarde --

1. Nueva contraseña
2. Confirmar contraseña
3. Botón Actualizar datos

# 29/10/2026 Temas varios

Envío recordatorio inscripción en charla mediante correo personalizado. Mirar como se puede personalizar cada correo. (Implementación posterior).

Revisión del diagrama Entidad-Relación de la BD.
Se acuerda empezar a mirar Docker.

## Correo confirmación usuario

Envío al registrarse y previo al primer login??

# 02/11/2026

Se inicializa el repo y se empiezan a crear las carpetas que hacian falta a fecha de hoy.
Se revisa el diagrama E-R

# 03/11/2026

Se revisan y validan las entidades y atributos de la base de datos y se empiezan a crear los modelos dentro de frontend/src/models/

Se crea rama frontend/modelos y rama frontend/api

Revisión boceto diseño información charlas.
