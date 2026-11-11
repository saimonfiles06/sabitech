# Sanctum apuntando a la tabla `usuarios` – SABITECH WEB

*Guía paso a paso para dejar Laravel Sanctum funcionando sobre la tabla `usuarios` (y no sobre `users`). Estado de partida a 10 de noviembre de 2026.*

**Cómo leer esta guía.** Cada paso tiene primero la explicación (qué hacemos y por qué) y después, o bien la **ruta del fichero** con el código tal y como debe quedar, o bien el **comando de consola** que hay que ejecutar.

**Convenciones**
- Las rutas de fichero son relativas a la raíz del repositorio (`sabitech/`).
- El proyecto Laravel está en `backend/app/`. Por eso un fichero como `app/Models/Usuario.php` está en `backend/app/app/Models/Usuario.php`.
- Los comandos de consola se ejecutan desde el directorio `backend`, igual que en `Pasos.md`.

## Estado de partida

| Pieza | Estado |
|---|---|
| Sanctum instalado (`composer.json`, `config/sanctum.php`) | Hecho |
| Migración `personal_access_tokens` (tabla donde Sanctum guarda los tokens) | Hecha |
| Tabla `usuarios` con `nombre`, `apellidos`, `correo_electronico`, `password`, `rol`, `correo_confirmado` | Hecha |
| Roles de `usuarios` | `usuario`, `administrador`, `ponente`, `supervisor` (se mantienen así) |
| Seeder de usuarios | Guarda la contraseña `password` ya con hash (`Hash::make`), así que sirve para probar el login |
| Modelo que Laravel usa para autenticar | **`User`** (tabla `users`, columnas `name` y `email`). **Es lo que hay que corregir.** |

**El problema.** Laravel decide de qué modelo saca a los usuarios mirando `config/auth.php`. Ahora mismo apunta a `User`, que es el modelo que trae Laravel por defecto: busca en la tabla `users` (vacía y sin uso) y no tiene lo necesario para crear tokens. Tus usuarios reales están en `usuarios`.

---

## Paso 1 · Crear el modelo `Usuario`

**Qué hacemos.** Generamos un modelo nuevo con la herramienta Artisan.

**Por qué.** Un modelo es la clase que representa una tabla. Sanctum funciona sobre un modelo: es el que "tiene" los tokens. Necesitamos uno que represente `usuarios`. Lo creamos nuevo, en castellano, en vez de adaptar `User`, para que el código sea coherente con el resto del proyecto (`Charla`, `Sala`, `Reserva`).

**Comando de consola** (desde `backend`):
```bash
docker compose exec web php artisan make:model Usuario
```
Crea el fichero `backend/app/app/Models/Usuario.php` con una plantilla vacía. En el paso siguiente lo rellenas.

---

## Paso 2 · Rellenar el modelo `Usuario`

**Qué hacemos.** Sustituimos el contenido de la plantilla por el modelo completo.

**Por qué, bloque a bloque.**
- `extends Authenticatable`: es la clase base de Laravel para modelos que pueden identificarse (iniciar sesión). Es la misma que usa `User.php`.
- `use HasApiTokens`: es el rasgo (`trait`) de Sanctum que añade al modelo el método `createToken()` y la relación con la tabla de tokens. **Sin esta línea, Sanctum no funciona.**
- `use Notifiable`: permite enviar notificaciones y correos al usuario. Lo necesitaremos para el correo de verificación.
- `protected $table = 'usuarios'`: Laravel ya deduciría ese nombre a partir de `Usuario`, pero escribirlo evita sorpresas y deja claro de qué tabla hablamos.
- `#[Fillable([...])]`: lista de columnas que se pueden rellenar de una vez al crear un usuario. Lo que no esté aquí no se puede asignar en bloque, y eso evita que alguien se cuele un `rol` que no debe. (`rol` aparece porque el registro lo fijará el servidor, no el usuario; ya lo controlaremos en el `AuthController`.)
- `#[Hidden(['password'])]`: la contraseña nunca sale en el JSON de una respuesta, aunque devuelvas el modelo entero.
- `casts()`: conversiones automáticas. `correo_confirmado` se maneja como fecha, y `password` como `hashed`: Laravel guarda el hash solo, sin que llames a `Hash::make()`.

**Fichero:** `backend/app/app/Models/Usuario.php`
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['nombre', 'apellidos', 'correo_electronico', 'password', 'rol'])]
#[Hidden(['password'])]
class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    // Tabla de la base de datos que representa este modelo
    protected $table = 'usuarios';

    // Conversiones automáticas de tipos
    protected function casts(): array
    {
        return [
            'correo_confirmado' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
```

**Nota sobre `correo_electronico`.** Laravel, por defecto, espera que la columna del correo se llame `email`. Para Sanctum no hace falta tocar nada: el login lo haremos buscando por `correo_electronico` en el `AuthController`. Más adelante, para el correo de verificación, habrá que decirle a Laravel cuál es tu columna.

---

## Paso 3 · Apuntar la autenticación al modelo nuevo

**Qué hacemos.** En `config/auth.php` cambiamos dos líneas: la importación y el modelo del *provider* `users`.

**Por qué.** El *provider* es la parte de la configuración que dice de dónde se sacan los usuarios. El *guard* (cómo se identifica a quien llama) lo usa por debajo. Al cambiar `User::class` por `Usuario::class`, Laravel pasa a buscar en `usuarios`. El nombre del provider (`'users'`) se queda como está, porque es solo una etiqueta interna y otras partes de la configuración se refieren a ella.

**Fichero:** `backend/app/config/auth.php`

Solo cambian estas dos zonas. El resto del fichero y sus comentarios se quedan igual.

Al principio del fichero, la importación:
```php
<?php

use App\Models\Usuario;
```

Y en el apartado `providers`:
```php
    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', Usuario::class),
        ],
    ],
```

**Comprobación.** Abre tu `.env` (en `backend/app/`) y asegúrate de que **no** existe una línea `AUTH_MODEL=...`. Si existiera, tendría prioridad sobre `Usuario::class` y seguirías apuntando al modelo antiguo. Si no existe, no hay que hacer nada.

---

## Paso 4 · Comprobar que la tabla de tokens está creada

**Qué hacemos.** Miramos qué migraciones están ejecutadas.

**Por qué.** Sanctum guarda cada token en la tabla `personal_access_tokens`. La migración que la crea ya está en el repositorio (`2026_11_10_115623_create_personal_access_tokens_table.php`), pero hay que asegurarse de que se ha ejecutado en tu base de datos. Usamos `migrate:status` y, si falta, `migrate`. Así **no** borramos nada: `migrate` solo añade lo pendiente y conserva tus datos de prueba. (No hace falta `migrate:fresh`, porque no hemos cambiado ninguna migración existente.)

**Comando de consola** (desde `backend`):
```bash
docker compose exec web php artisan migrate:status
```
En la lista debe aparecer `create_personal_access_tokens_table` con el estado **Ran**.

**Solo si aparece como Pending**, ejecuta:
```bash
docker compose exec web php artisan migrate
```

---

## Paso 5 · Probar que Sanctum crea tokens sobre `usuarios`

**Qué hacemos.** Entramos en Tinker, la consola interactiva de Laravel, y creamos un token a mano para un usuario real.

**Por qué.** Es la forma más rápida de comprobar que todo está conectado (modelo, tabla de usuarios y tabla de tokens) sin escribir todavía controladores ni rutas. Si esto funciona, el trabajo de configuración está hecho.

**Comando de consola** para abrir Tinker (desde `backend`):
```bash
docker compose exec web php artisan tinker
```

**Dentro de Tinker** (son líneas de PHP, no de consola; ejecútalas de una en una):
```php
$usuario = App\Models\Usuario::first();
$usuario->correo_electronico;
$usuario->createToken('prueba')->plainTextToken;
$usuario->tokens()->count();
```

Qué debe salir:
- La segunda línea muestra el correo del primer usuario (por ejemplo `admin@correo.es`). Confirma que el modelo lee de `usuarios`.
- La tercera devuelve el token, una cadena larga con un `|` en medio (por ejemplo `1|AbC...`). Esa cadena es lo que el frontend enviará en cada petición.
- La cuarta devuelve `1`.

Para borrar el token de prueba y salir:
```php
$usuario->tokens()->delete();
exit
```

---

## Paso 6 · Ver en la base de datos que el token apunta a `Usuario`

**Qué hacemos.** Consultamos la tabla `personal_access_tokens` directamente en MySQL.

**Por qué.** Esta tabla guarda, para cada token, a quién pertenece mediante dos columnas: `tokenable_type` (la clase del modelo) y `tokenable_id` (el id del usuario). Ahí se ve claramente que el token está ligado a `App\Models\Usuario` y no al modelo antiguo. Haz esta comprobación **antes** de borrar el token de prueba (es decir, entre las líneas 3 y 4 del paso 5), o crea otro token.

**Comando de consola** (desde `backend`; te pedirá la contraseña de la base de datos):
```bash
docker compose exec db mysql -u sabitech_user -p sabitech -e "SELECT id, tokenable_type, tokenable_id, name FROM personal_access_tokens;"
```
Debe verse una fila con `tokenable_type` = `App\Models\Usuario`.

---

## Paso 7 · Caducidad de los tokens (recomendado)

**Qué hacemos.** Ponemos una duración máxima a los tokens.

**Por qué.** Por defecto `expiration` vale `null`, y un token no caduca nunca: si alguien lo robara, valdría para siempre. El número es de **minutos**. 480 son 8 horas, suficiente para una jornada de charlas. Es opcional ahora, pero conviene decidirlo antes de la defensa, porque el enunciado valora la seguridad de la autenticación.

**Fichero:** `backend/app/config/sanctum.php`

Solo cambia esta línea (está en torno a la línea 53):
```php
    'expiration' => 480,
```

---

## Paso 8 · Lo que NO hay que tocar (todavía)

**Qué hacemos.** Dejamos como está lo que parece sobrar.

**Por qué.**
- **No borres** la migración `0001_01_01_000000_create_users_table.php`. Además de la tabla `users` crea `sessions` y `password_reset_tokens`, que Laravel sigue usando (`SESSION_DRIVER=database`). La tabla `users` quedará vacía y sin uso; no molesta.
- **No borres todavía** `app/Models/User.php` ni `database/factories/UserFactory.php`. Cuando el login por token funcione de principio a fin, podrás eliminarlos para que no haya dos modelos de usuario y nadie se confunda. Antes de borrarlos, busca en el proyecto que ningún otro fichero los use.
- **El seeder no necesita cambios**: `UsuarioSeeder` ya guarda la contraseña con `Hash::make('password')`, así que cualquier cuenta de prueba (`admin@correo.es`, `ponente@correo.es`, `usuario@correo.es`) podrá entrar con la contraseña `password`. `DatabaseSeeder` no usa `User::factory()`, así que no da problemas.
- **El rol `supervisor` no tiene usuario de prueba** en el seeder. Cuando llegues a las Policies y al control de accesos te hará falta uno; entonces se añade una línea más en `UsuarioSeeder`, como las de admin, ponente y usuario.

---

## Paso 9 · Avisar al equipo en `Pasos.md`

**Qué hacemos.** Actualizamos la sección de Sanctum de `Pasos.md`.

**Por qué.** Tus compañeros tienen que traerse el modelo nuevo y la configuración. Como no se ha cambiado ninguna migración existente, no necesitan reconstruir la base de datos: les basta `composer install` y `migrate`.

**Fichero:** `Sabitech docs/Pasos.md`

Sustituye el final del fichero (desde "Instalación de Sanctum en el backend") por:

````markdown
**Instalación de Sanctum en el backend**
Esta parte solo lo hace uno, en este caso lo he hecho yo (David).

*No ejecuteis estos comandos*, hacen la primera instalación.
```bash
docker compose exec web php artisan install:api
```

Sanctum usa el modelo `Usuario` (tabla `usuarios`), no el modelo `User` que trae Laravel.
Está configurado en `backend/app/config/auth.php` (provider `users` → `Usuario::class`).

Lo que tenéis que hacer es:
Actualizar el repositorio y después en el directorio de Backend ejecutar...
```bash
docker compose exec web composer install
docker compose exec web php artisan migrate
```

Para comprobar que funciona (opcional):
```bash
docker compose exec web php artisan tinker
```
y dentro: `App\Models\Usuario::first()->createToken('prueba')->plainTextToken;`
````

Después, commit y push con un mensaje claro, por ejemplo: `Sanctum apunta a la tabla usuarios con el modelo Usuario`.

---

## Resultado esperado

Al terminar:
- Existe el modelo `Usuario` con `HasApiTokens`, ligado a la tabla `usuarios`.
- `config/auth.php` apunta a `Usuario`.
- Tinker crea un token para un usuario real y la tabla `personal_access_tokens` lo guarda con `tokenable_type` = `App\Models\Usuario`.

## Siguiente fase (todavía sin hacer)
1. `AuthController` con registro, login (busca por `correo_electronico`, comprueba con `Hash::check` y devuelve el token) y logout (borra el token).
2. Rutas en `routes/api.php`: públicas (login y registro) y protegidas con el middleware `auth:sanctum`.
3. Policies por rol (`usuario`, `administrador`, `ponente`, `supervisor`).
4. Login en React: guardar el token y enviarlo en la cabecera `Authorization: Bearer`.
5. Configurar CORS para que React pueda llamar a la API.

*Pendiente de revisar en `Base_de_datos.md`: sigue listando los roles antiguos (`asistente`, `personal_acceso`). Deben quedar como `usuario`, `administrador`, `ponente` y `supervisor`.*