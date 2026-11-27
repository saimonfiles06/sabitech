
# Diseño de endpoints REST

**Endpoints de usuarios**

|            |               |                    |          |
| ---------- | ------------- | ------------------ | -------- |
| **Método** | **Endpoint**  | **Descripción**    | **HTTP** |
| GET        | /usuarios     | Listar usuarios    | 200      |
| GET        | /usuarios/:id | Obtener usuario    | 200      |
| POST       | /usuarios     | Crear usuario      | 201      |
| PUT        | /usuarios/:id | Actualizar usuario | 200      |
| DELETE     | /usuarios/:id | Eliminar usuario   | 204      |


**Endpoints de charlas**

|   |   |   |   |
|---|---|---|---|
|**Método**|**Endpoint**|**Descripción**|**HTTP**|
|GET|/charlas|Listar charlas|200|
|GET|/charlas/:id|Obtener charla|200|
|POST|/charlas|Crear charla|201|
|PUT|/charlas/:id|Actualizar charla|200|
|DELETE|/charlas/:id|Eliminar charla|204|


**Endpoints de reservas**

|            |                     |                                  |          |
| ---------- | ------------------- | -------------------------------- | -------- |
| **Método** | **Endpoint**        | **Descripción**                  | **HTTP** |
| GET        | /reservas/:id       | Consultar reservas de un usuario | 200      |
| GET        | /reservas/:idCharla | Listar reservas de una charla    | 200      |
| POST       | /reservas           | Crear reserva                    | 201      |
| PUT        | /reservas/:id       | Modificar reserva                | 200      |
| DELETE     | /reservas/:id       | Cancelar reserva                 | 204      |



**Resumen de códigos HTTP**

Los principales códigos de estado utilizados serán:

|            |                       |                                     |
| ---------- | --------------------- | ----------------------------------- |
| **Código** | **Nombre**            | **Utilización**                     |
| 200        | OK                    | Operación correcta                  |
| 201        | Created               | Recurso creado                      |
| 204        | No Content            | Eliminación sin cuerpo de respuesta |
| 400        | Bad Request           | Datos incorrectos                   |
| 401        | Unauthorized          | Usuario no autenticado              |
| 403        | Forbidden             | Acceso no permitido                 |
| 404        | Not Found             | Recurso inexistente                 |
| 409        | Conflict              | Reserva duplicada o sin plazas      |
| 500        | Internal Server Error | Error interno                       |

# Endpoints

**2. Endpoints y métodos HTTP**

| **Método**   | **Endpoint**                        | **Descripción**                                                          | Quien                           | Datos que manda                                                                                                                                                                                                                                                                                                                                                                                | **Código típico**             |
| ------------ | ----------------------------------- | ------------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| GET          | /usuario                            | Lista usuarios registrados                                               | Solo administrador              | 'id'<br>'nombre'<br>'apellidos'<br>'correo_electronico'<br>'rol'<br>'correo_confirmado'<br>'created_at'                                                                                                                                                                                                                                                                                        | 200 OK                        |
| GET          | /usuario/{userId}                   | Obtiene un usuario por ID                                                | Administrador y propio usuario  | 'id'<br>'nombre'<br>'apellidos'<br>'correo_electronico'<br>'rol' ==🟠-> Solo a Admin==<br>'correo_confirmado'<br>'created_at'                                                                                                                                                                                                                                                                  | 200 OK / 404                  |
| POST         | /registro                           | Registra un nuevo usuario                                                | Administrador y propio usuario  |                                                                                                                                                                                                                                                                                                                                                                                                | 201 Created / 409             |
| PUT          | /usuario/{userId}                   | Actualiza los datos de un usuario                                        | Administrador y propio usuario  |                                                                                                                                                                                                                                                                                                                                                                                                | 200 OK / 404                  |
| DELETE       | /usuario/{userId}                   | Elimina un usuario                                                       | Solo administrador              |                                                                                                                                                                                                                                                                                                                                                                                                | 200 OK / 404                  |
| GET          | /charlas                            | Lista charlas (soporta filtros como ?rama=tech)                          | Todo el mundo                   | 'charlas.id'<br>'charlas.titulo','charlas.rama'<br>'nombre_ponente'<br>'apellidos_ponente'<br>'nombre_supervisor'<br>'apellidos_supervisor'<br>'charlas.resumen_contenido'<br>'charlas.contenido'<br>'charlas.url_imagen'<br>'nombre_sala'<br>'salas.aforo'<br>'charlas.fecha_hora_charla'<br>'charlas.fecha_hora_entrada'<br>'charlas.fecha_hora_fin'<br>'plazas_ocupadas'<br>'plazas_libres' | 200 OK                        |
| GET          | /charla/{charlaId}                  | Obtiene el detalle de una charla y su disponibilidad                     | Todo el mundo                   | 'charlas.id'<br>'charlas.titulo','charlas.rama'<br>'nombre_ponente'<br>'apellidos_ponente'<br>'nombre_supervisor'<br>'apellidos_supervisor'<br>'charlas.resumen_contenido'<br>'charlas.contenido'<br>'charlas.url_imagen'<br>'nombre_sala'<br>'salas.aforo'<br>'charlas.fecha_hora_charla'<br>'charlas.fecha_hora_entrada'<br>'charlas.fecha_hora_fin'<br>'plazas_ocupadas'<br>'plazas_libres' | 200 OK / 404                  |
| POST         | /charla                             | Crea una nueva charla                                                    | Administrador y ==🟠¿ponente?== |                                                                                                                                                                                                                                                                                                                                                                                                | 201 Created                   |
| PUT          | /charla/{charlaId}                  | Reemplaza/actualiza los datos de una charla                              | Administrador y ponente         |                                                                                                                                                                                                                                                                                                                                                                                                | 200 OK / 404                  |
| DELETE       | /charla/{charlaId}                  | Elimina una charla                                                       | Administrador                   |                                                                                                                                                                                                                                                                                                                                                                                                | 200 OK / 204 No Content       |
| GET          | /charla/{charlaId}/reserva          | Lista reservas de una charla<br>(soporta filtros como ?estado=cancelada) | Administrador y ponente         | 'reserva.id'<br>'usuario.nombre'<br>'usuario.apellidos'<br>'created_at'<br>'updated_at'<br>                                                                                                                                                                                                                                                                                                    | 200 OK / 404                  |
| POST         | /charla/{charlaId}/reserva/{userId} | Reserva plaza para un usuario en la charla                               | Administrador , usuario         |                                                                                                                                                                                                                                                                                                                                                                                                | 201 Created / 400 / 404 / 409 |
| PUT          | /reserva/{reservaId}                | Actualiza estado de una reserva                                          | Administrador , usuario         |                                                                                                                                                                                                                                                                                                                                                                                                | 200 OK / 404 / 409            |
| ==🟠DELETE== | /reserva/{reservaId}                | Cancela/elimina una reserva y libera plazas                              | Administrador y usuario         |                                                                                                                                                                                                                                                                                                                                                                                                | 200 OK / 404                  |
|              |                                     |                                                                          |                                 |                                                                                                                                                                                                                                                                                                                                                                                                |                               |


# Modelo de datos

Se definen tres entidades principales.

Usuario

|   |   |   |
|---|---|---|
|**Campo**|**Tipo**|**Descripción**|
|id|Integer|Identificador único|
|nombre|String|Nombre completo|
|email|String|Correo electrónico único|
|password|String|Contraseña almacenada mediante hash|
|createdAt|Date|Fecha de creación|

Charla

|   |   |   |
|---|---|---|
|**Campo**|**Tipo**|**Descripción**|
|id|Integer|Identificador único|
|titulo|String|Título de la charla|
|descripcion|String|Descripción|
|fecha|DateTime|Fecha y hora|
|capacidad|Integer|Número máximo de asistentes|
|plazasDisponibles|Integer|Plazas restantes|

Reserva

|   |   |   |
|---|---|---|
|**Campo**|**Tipo**|**Descripción**|
|id|Integer|Identificador único|
|usuarioId|Integer|Usuario que reserva|
|charlaId|Integer|Charla reservada|
|fechaReserva|DateTime|Fecha de reserva|

Relaciones:

Un usuario puede realizar muchas reservas.

Una charla puede tener muchas reservas.

Un usuario no puede reservar dos veces la misma charla.

Una charla no puede superar su capacidad máxima.

