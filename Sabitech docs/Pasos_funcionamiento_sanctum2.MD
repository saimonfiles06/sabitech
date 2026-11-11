# Autenticación completa (login, registro y logout) – SABITECH WEB

_Guía paso a paso para conectar los formularios de login y registro de React con Laravel Sanctum. Estado de partida a 11 de noviembre de 2026, tras el merge de `sanctum` en `main`._

**Cómo leer esta guía.** Igual que la guía de Sanctum: cada paso tiene primero la explicación (qué hacemos y por qué) y después la **ruta del fichero** con el código tal y como debe quedar, o el **comando de consola** que hay que ejecutar.

**Convenciones**

- Las rutas de fichero son relativas a la raíz del repositorio (`sabitech/`).
- El proyecto Laravel está en `backend/app/` (por eso un controlador está en `backend/app/app/Http/Controllers/`). El frontend React está en `frontend/`.
- Los comandos de Laravel se ejecutan desde el directorio `backend`. Los de `npm` y `curl`, como se indica en cada caso.
- Nombres en castellano en todo lo que el lenguaje permite. Lo que no se puede traducir (palabras reservadas, nombres de métodos de Laravel o de React, opciones de `fetch`) se queda en inglés.

---

## Estado del proyecto (revisión del 11 de noviembre)

|Parte|Estado|
|---|---|
|Sanctum instalado y probado sobre `usuarios` (modelo `Usuario`, `config/auth.php`, tabla de tokens)|**Hecho** y ya en `main` (rama `sanctum`)|
|Caducidad de los tokens|**Hecha**: `expiration` = 360 minutos (6 horas)|
|`LoginView.jsx` y `RegisterView.jsx` (formularios con validación en el navegador)|**Hechos** y ya en `main` (los hizo saimonfiles06). Su envío está sin conectar: acaban en un `console.log` con el comentario "Pendiente: conectar con Laravel Sanctum"|
|Backend: registro, login, logout y rutas de autenticación|**Sin hacer.** No existe `AuthController` y `routes/api.php` solo tiene `GET` abiertos|
|Frontend: llamadas a la API de autenticación, guardar el token, rutas de pantalla|**Sin hacer**|
|CORS|**Sin problema**: Laravel trae por defecto una configuración que permite las peticiones a `api/*` desde cualquier origen. No hay que hacer nada|
|Roles (`usuario`, `administrador`, `ponente`, `supervisor`)|Cerrados. Falta ajustar `Base_de_datos.md`|

**Cosas que encontré y conviene saber**

1. **No hay enrutador en React.** `App.jsx` muestra siempre `InicioView`. Los enlaces `/login` y `/registro` son `<a href>` normales, así que ahora mismo llevan a la misma página de inicio. Hay que instalar `react-router-dom` (paso 8).
2. **`LoginView` imprime en la consola el correo y la contraseña** (`console.log`). Es provisional, pero hay que quitarlo al conectar (paso 11).
3. **`/api/usuarios` y `/api/reservas` están abiertas a todo el mundo.** `/usuarios` devuelve todos los correos. De momento la página de inicio la usa para sus listas de prueba, así que no se protege en esta guía, pero está anotado como pendiente al final. `/reservas` sí se protege ya.
4. **Fichero sobrante:** existe `frontend/src/api/UsuarioApi` (sin extensión), copia de `UsuarioApi.js`. Parece accidental; conviene borrarlo.
5. **Rama local `frontend/login`:** en el servidor ya no existe (marcada `gone`), y su commit `69d6530` está dentro de `main`. Se puede borrar en local con git cuando quieras.
6. **La URL de la API (`http://localhost:8080/api/`) está repetida** en cada fichero de `src/api/`. Esta guía sigue el mismo patrón para no mezclar cambios; centralizarla queda como mejora.

**Decisiones que tomo en esta guía (dime si cambias alguna)**

|Decisión|Motivo|
|---|---|
|Enrutador: **React Router**|Es el estándar de React para varias pantallas y es lo que más se explica en documentación|
|Token guardado en **`sessionStorage`**|`User.js` ya tiene un `toJSON` pensado para ello. El token se borra al cerrar la pestaña, y además caduca a las 6 horas|
|El **registro inicia sesión directamente** (devuelve token)|Simplifica la demo. La verificación del correo (`correo_confirmado`) se añadirá después con el correo de alta|
|El **rol nunca viene del formulario**|Todo usuario nuevo es `usuario`. Solo un administrador podrá cambiar roles más adelante|

---

# PARTE A · Backend (Laravel)

## Paso 1 · Quitar `rol` de los campos rellenables

**Qué hacemos.** En el modelo `Usuario`, sacamos `'rol'` de la lista `#[Fillable]`.

**Por qué.** `Fillable` es la lista de columnas que se pueden rellenar de golpe con `Usuario::create([...])`. Si `rol` está ahí y algún día se pasa por error el contenido de la petición entero, alguien podría registrarse como `administrador` enviando `"rol": "administrador"` (es el fallo llamado asignación masiva). Sin `rol` en la lista, es imposible, y la base de datos pone `usuario` por defecto. El seeder no se ve afectado porque inserta con `DB::table`, no con el modelo.

**Fichero:** `backend/app/app/Models/Usuario.php`

Solo cambia la línea de `Fillable`:

```php
#[Fillable(['nombre', 'apellidos', 'correo_electronico', 'password'])]
```

---

## Paso 2 · Crear el controlador de autenticación

**Qué hacemos.** Generamos el fichero del controlador con Artisan.

**Por qué.** Un controlador agrupa en una clase las acciones relacionadas. Aquí van las cuatro de la autenticación: registrarse, iniciar sesión, cerrar sesión y ver el perfil propio.

**Comando de consola** (desde `backend`):

```bash
docker compose exec web php artisan make:controller AuthController
```

Crea `backend/app/app/Http/Controllers/AuthController.php` con una plantilla vacía.

---

## Paso 3 · Escribir el `AuthController`

**Qué hacemos.** Rellenamos el controlador con sus cuatro acciones.

**Por qué, bloque a bloque.**

- **`registro`**: valida los datos en el servidor (el enunciado exige validar también en el servidor, aunque el navegador ya lo haga). Reglas: `unique:usuarios,correo_electronico` impide dos cuentas con el mismo correo, `min:8` exige una contraseña mínima, `same:password` comprueba la repetición, y los `max:50` coinciden con el tamaño de las columnas. Después crea el usuario (Laravel guarda el hash de la contraseña solo, por el `casts` del modelo) y devuelve un token. Si algún dato falla, Laravel responde solo con un `422` y la lista de errores.
- **`$usuario->refresh()`**: tras crear, el modelo no conoce el `rol` que puso la base de datos por defecto. `refresh()` lo vuelve a leer para devolverlo en la respuesta.
- **`login`**: busca por `correo_electronico` y comprueba la contraseña con `Hash::check`. Si el correo no existe **o** la contraseña es incorrecta, da **el mismo mensaje** y el mismo código `401`. Así no se revela qué correos están registrados (el enunciado pide que los errores no revelen información interna).
- **`logout`**: borra solo el token con el que se hizo la petición. La sesión de ese dispositivo deja de valer; el resto de tokens del usuario (otros dispositivos) siguen.
- **`perfil`**: devuelve los datos del usuario que hace la petición. El frontend lo usará para comprobar que la sesión sigue siendo válida.
- **`datosUsuario`**: un método privado que decide qué campos salen. Usa los mismos nombres que ya espera `User.fromJSON` del frontend (`correo_electronico`, `created_at`), y nunca incluye la contraseña.

**Fichero:** `backend/app/app/Http/Controllers/AuthController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // POST /api/registro
    public function registro(Request $peticion): JsonResponse
    {
        $datos = $peticion->validate(
            [
                'nombre'             => ['required', 'string', 'max:50'],
                'apellidos'          => ['required', 'string', 'max:50'],
                'correo_electronico' => ['required', 'email', 'max:50', 'unique:usuarios,correo_electronico'],
                'password'           => ['required', 'string', 'min:8'],
                'confirmar_password' => ['required', 'same:password'],
            ],
            [
                'required'                  => 'El campo :attribute es obligatorio.',
                'email'                     => 'Introduce un correo electrónico válido.',
                'max'                       => 'El campo :attribute no puede superar los :max caracteres.',
                'min'                       => 'La contraseña debe tener al menos :min caracteres.',
                'same'                      => 'Las contraseñas no coinciden.',
                'correo_electronico.unique' => 'Ya existe una cuenta con ese correo.',
            ],
            [
                'correo_electronico' => 'correo electrónico',
                'confirmar_password' => 'confirmación de contraseña',
            ]
        );

        // El rol no se rellena aquí: la base de datos pone "usuario" por defecto
        $usuario = Usuario::create([
            'nombre'             => $datos['nombre'],
            'apellidos'          => $datos['apellidos'],
            'correo_electronico' => $datos['correo_electronico'],
            'password'           => $datos['password'],
        ]);

        // Vuelve a leer el usuario para incluir el rol que puso la base de datos
        $usuario->refresh();

        return response()->json([
            'token'   => $usuario->createToken('sabitech')->plainTextToken,
            'usuario' => $this->datosUsuario($usuario),
        ], 201);
    }

    // POST /api/login
    public function login(Request $peticion): JsonResponse
    {
        $datos = $peticion->validate([
            'correo_electronico' => ['required', 'email'],
            'password'           => ['required', 'string'],
        ]);

        $usuario = Usuario::where('correo_electronico', $datos['correo_electronico'])->first();

        // Mismo mensaje si falla el correo o la contraseña, para no revelar qué correos existen
        if (! $usuario || ! Hash::check($datos['password'], $usuario->password)) {
            return response()->json(['message' => 'Correo o contraseña incorrectos.'], 401);
        }

        return response()->json([
            'token'   => $usuario->createToken('sabitech')->plainTextToken,
            'usuario' => $this->datosUsuario($usuario),
        ]);
    }

    // POST /api/logout (requiere token)
    public function logout(Request $peticion): JsonResponse
    {
        // Borra solo el token con el que se ha hecho esta petición
        $peticion->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada.']);
    }

    // GET /api/perfil (requiere token)
    public function perfil(Request $peticion): JsonResponse
    {
        return response()->json($this->datosUsuario($peticion->user()));
    }

    // Campos del usuario que se envían al frontend (nunca la contraseña)
    private function datosUsuario(Usuario $usuario): array
    {
        return [
            'id'                 => $usuario->id,
            'nombre'             => $usuario->nombre,
            'apellidos'          => $usuario->apellidos,
            'correo_electronico' => $usuario->correo_electronico,
            'rol'                => $usuario->rol,
            'correo_confirmado'  => $usuario->correo_confirmado,
            'created_at'         => $usuario->created_at,
        ];
    }
}
```

---

## Paso 4 · Rutas de la API

**Qué hacemos.** Añadimos las rutas de autenticación y movemos `/reservas` a un grupo protegido.

**Por qué.**

- `registro` y `login` son públicas (alguien sin cuenta tiene que poder entrar), pero llevan un **límite de intentos** con `throttle:10,1`: máximo 10 peticiones por minuto desde la misma IP. Frena a quien pruebe contraseñas una tras otra. Al pasarse, Laravel responde `429`.
- El grupo `auth:sanctum` es un _middleware_: un filtro que se ejecuta antes del controlador. Si la petición no trae un token válido (o ha caducado), responde `401` y el controlador ni se ejecuta. `logout`, `perfil` y `reservas` van dentro.
- `/charlas` se queda pública: es el catálogo que ve cualquiera. `/prueba` y `/usuarios` no se tocan (ver "Pendiente" al final).

**Fichero:** `backend/app/routes/api.php`

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PruebaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CharlaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ReservaController;

// Rutas públicas
Route::get('/prueba', [PruebaController::class, 'index']);
Route::get('/charlas', [CharlaController::class, 'index']);
Route::get('/usuarios', [UsuarioController::class, 'index']);

// Autenticación: con límite de 10 intentos por minuto
Route::post('/registro', [AuthController::class, 'registro'])->middleware('throttle:10,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

// Rutas que exigen un token válido
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/perfil', [AuthController::class, 'perfil']);
    Route::get('/reservas', [ReservaController::class, 'index']);
});
```

---

## Paso 5 · Comprobar las rutas

**Qué hacemos.** Pedimos a Laravel la lista de rutas de la API.

**Por qué.** Confirma que Laravel ha leído el fichero y que cada ruta tiene el middleware que esperas, antes de probar nada con peticiones.

**Comando de consola** (desde `backend`):

```bash
docker compose exec web php artisan route:list --path=api
```

Deben aparecer `POST api/registro`, `POST api/login`, `POST api/logout`, `GET api/perfil` y `GET api/reservas`, estas tres últimas con `auth:sanctum`.

---

## Paso 6 · Probar el backend con `curl` (antes de tocar React)

**Qué hacemos.** Lanzamos peticiones a mano con `curl`, un programa de terminal que hace peticiones HTTP.

**Por qué.** Si el backend funciona aquí, cualquier fallo posterior será del frontend. Estas pruebas son además las que pide el enunciado para la autenticación y los permisos: acceso correcto, acceso sin token y credenciales erróneas. Guarda lo que veas para la memoria.

`Accept: application/json` es importante: le dice a Laravel que responda siempre en JSON.

Ejecuta cada comando en el terminal del Mac (en cualquier carpeta; no es de Docker).

**Comando de consola** · login correcto (la cuenta de prueba usa la contraseña `password`):

```bash
curl -s -X POST http://localhost:8080/api/login -H "Accept: application/json" -H "Content-Type: application/json" -d '{"correo_electronico":"admin@correo.es","password":"password"}'
```

Debe devolver un JSON con `token` (algo como `3|AbC...`) y `usuario`. Copia el token.

**Comando de consola** · login con contraseña incorrecta (debe dar `401` y el mensaje "Correo o contraseña incorrectos."):

```bash
curl -s -i -X POST http://localhost:8080/api/login -H "Accept: application/json" -H "Content-Type: application/json" -d '{"correo_electronico":"admin@correo.es","password":"mal"}'
```

**Comando de consola** · pedir reservas **sin** token (debe dar `401`):

```bash
curl -s -i http://localhost:8080/api/reservas -H "Accept: application/json"
```

**Comando de consola** · pedir el perfil **con** token (sustituye `TU_TOKEN` por el que copiaste; debe devolver los datos de admin):

```bash
curl -s http://localhost:8080/api/perfil -H "Accept: application/json" -H "Authorization: Bearer TU_TOKEN"
```

**Comando de consola** · cerrar sesión, y repetir el comando anterior (ahora debe dar `401`):

```bash
curl -s -X POST http://localhost:8080/api/logout -H "Accept: application/json" -H "Authorization: Bearer TU_TOKEN"
```

**Comando de consola** · registro con datos incorrectos (contraseña corta y distinta: debe dar `422` con la lista de errores en español):

```bash
curl -s -i -X POST http://localhost:8080/api/registro -H "Accept: application/json" -H "Content-Type: application/json" -d '{"nombre":"Ana","apellidos":"Prueba","correo_electronico":"ana@correo.es","password":"123","confirmar_password":"456"}'
```

---

# PARTE B · Frontend (React)

Todos los comandos y ficheros de esta parte están en la carpeta `frontend/`.

## Paso 7 · Instalar React Router

**Qué hacemos.** Instalamos la librería de rutas de pantalla.

**Por qué.** Ahora `App.jsx` solo sabe mostrar `InicioView`. React Router permite que cada dirección del navegador (`/`, `/login`, `/registro`) muestre una pantalla distinta sin recargar la página.

**Comando de consola** (desde la carpeta `frontend`, en tu terminal; el frontend no corre en Docker):

```bash
npm install react-router-dom
```

Modifica `package.json` y `package-lock.json`. Tus compañeros deberán ejecutar `npm install` tras hacer `git pull`.

---

## Paso 8 · Pantallas por ruta

**Qué hacemos.** Envolvemos la aplicación en el enrutador y definimos qué pantalla va con cada dirección.

**Por qué.** `BrowserRouter` activa el enrutador y debe envolver a toda la app. Dentro, `Routes` elige la pantalla según la URL. Con `<Route path="*">` cualquier dirección desconocida vuelve al inicio.

**Fichero:** `frontend/src/main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ProveedorAuth } from './auth/ContextoAuth.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorAuth>
        <App />
      </ProveedorAuth>
    </BrowserRouter>
  </StrictMode>,
)
```

(`ProveedorAuth` se crea en el paso 10.)

**Fichero:** `frontend/src/App.jsx`

```jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { InicioView } from "./views/InicioView.jsx";
import { LoginView } from "./views/LoginView.jsx";
import { RegisterView } from "./views/RegisterView.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<InicioView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/registro" element={<RegisterView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
```

---

## Paso 9 · Funciones de la API de autenticación

**Qué hacemos.** Creamos `AuthApi.js`, que habla con las rutas del paso 4.

**Por qué, bloque a bloque.** Sigue el patrón de `CharlaApi.js` y `UsuarioApi.js` (funciones `async`, error `ApiError` si el servidor responde 4xx/5xx), pero como las cuatro llamadas son casi iguales, hay una función interna `enviar` que construye la petición y el resto la reutilizan.

- `Accept: application/json` hace que Laravel responda siempre en JSON.
- Si hay token, se manda en la cabecera `Authorization: Bearer <token>`, que es como Sanctum identifica al usuario.
- Al lanzar `ApiError` se pasa también el JSON completo (`json`), porque en un error `422` la lista de errores por campo viene ahí.
- `login` y `registro` devuelven `{ token, usuario }`, con `usuario` ya convertido a un objeto `User` (usando `User.fromJSON`, que ya existe).

**Fichero (nuevo):** `frontend/src/api/AuthApi.js`

```js
import { ApiError } from "./ApiError.js";
import { User } from "../models/User.js";

const API_BASE_URL = "http://localhost:8080/api/";

// Función interna: prepara y envía una petición a la API
async function enviar(ruta, { metodo = "GET", cuerpo = null, token = null } = {}) {
  const cabeceras = { Accept: "application/json" };

  if (cuerpo) {
    cabeceras["Content-Type"] = "application/json";
  }
  if (token) {
    cabeceras.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    method: metodo,
    headers: cabeceras,
    body: cuerpo ? JSON.stringify(cuerpo) : null,
  });

  const json = await respuesta.json();

  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, json.message, json);
  }
  return json;
}

/** Inicia sesión. Devuelve { token, usuario } */
export async function login(correo, password) {
  const json = await enviar("login", {
    metodo: "POST",
    cuerpo: { correo_electronico: correo, password },
  });
  return { token: json.token, usuario: User.fromJSON(json.usuario) };
}

/** Crea la cuenta e inicia sesión. Devuelve { token, usuario } */
export async function registro({ nombre, apellidos, correo, password, confirmarPassword }) {
  const json = await enviar("registro", {
    metodo: "POST",
    cuerpo: {
      nombre,
      apellidos,
      correo_electronico: correo,
      password,
      confirmar_password: confirmarPassword,
    },
  });
  return { token: json.token, usuario: User.fromJSON(json.usuario) };
}

/** Cierra la sesión en el servidor (borra el token) */
export async function logout(token) {
  return enviar("logout", { metodo: "POST", token });
}

/** Datos del usuario del token. Sirve para comprobar que la sesión sigue válida */
export async function perfil(token) {
  const json = await enviar("perfil", { token });
  return User.fromJSON(json);
}
```

---

## Paso 10 · Contexto de autenticación (quién ha iniciado sesión)

**Qué hacemos.** Creamos un _contexto_ de React: un lugar común donde guardar el usuario y el token, accesible desde cualquier pantalla.

**Por qué.** Varias pantallas necesitan saber si hay sesión: el inicio (para mostrar "Cerrar sesión"), el login (para iniciarla), las reservas (para el token)... Sin contexto habría que pasar los datos de componente en componente. Con él, cualquier pantalla escribe `const { usuario } = useAuth()`.

**Por qué, bloque a bloque.**

- `leerSesionGuardada`: al abrir la página, mira en `sessionStorage` si ya había una sesión (así al recargar con F5 no se pierde). El `try/catch` evita que un dato corrupto rompa la app. `new User(usuario)` reconstruye el objeto `User` a partir del objeto plano que guardó `User.toJSON`.
- `guardarSesion`: guarda token y usuario en `sessionStorage` y en el estado de React (el estado es lo que hace que la pantalla se actualice).
- `cerrarSesion`: avisa al servidor para que borre el token. Si el aviso falla (token ya caducado, sin conexión), da igual: se borra la sesión local de todos modos.
- `useAuth`: la función corta que usarán las pantallas.

**Fichero (nuevo):** `frontend/src/auth/ContextoAuth.jsx`

```jsx
import { createContext, useContext, useState } from "react";
import { User } from "../models/User.js";
import * as AuthApi from "../api/AuthApi.js";

const CLAVE_SESION = "sabitech_sesion";

const ContextoAuth = createContext(null);

// Recupera la sesión guardada en el navegador (si la hay)
function leerSesionGuardada() {
  try {
    const texto = sessionStorage.getItem(CLAVE_SESION);
    if (!texto) return null;

    const { token, usuario } = JSON.parse(texto);
    return { token, usuario: new User(usuario) };
  } catch {
    return null;
  }
}

export function ProveedorAuth({ children }) {
  const [sesion, setSesion] = useState(leerSesionGuardada);

  function guardarSesion(nuevaSesion) {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(nuevaSesion));
    setSesion(nuevaSesion);
  }

  async function iniciarSesion(correo, password) {
    const nuevaSesion = await AuthApi.login(correo, password);
    guardarSesion(nuevaSesion);
  }

  async function registrarse(datos) {
    const nuevaSesion = await AuthApi.registro(datos);
    guardarSesion(nuevaSesion);
  }

  async function cerrarSesion() {
    try {
      await AuthApi.logout(sesion.token);
    } catch {
      // Si el token ya había caducado, no pasa nada: cerramos la sesión local igualmente
    }
    sessionStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  }

  const valor = {
    usuario: sesion ? sesion.usuario : null,
    token: sesion ? sesion.token : null,
    iniciarSesion,
    registrarse,
    cerrarSesion,
  };

  return <ContextoAuth.Provider value={valor}>{children}</ContextoAuth.Provider>;
}

// Función corta para usar el contexto desde cualquier pantalla
export function useAuth() {
  return useContext(ContextoAuth);
}
```

(`JSON.stringify(nuevaSesion)` llama solo a `User.toJSON`, que ya existe y deja los datos en un objeto plano.)

---

## Paso 11 · Conectar `LoginView`

**Qué hacemos.** Sustituimos el `console.log` provisional por la llamada real a `iniciarSesion`.

**Por qué, bloque a bloque.**

- Se conservan **las validaciones que ya tienes** (campos obligatorios y formato del correo). Son útiles para no molestar al servidor con datos evidentemente malos; las que cuentan de verdad son las del servidor.
- Se **elimina el `console.log`** que mostraba la contraseña.
- `enviando` evita pulsar el botón dos veces mientras espera la respuesta.
- `navegar("/")` lleva al inicio cuando el login ha ido bien.
- En el `catch`: si el error es un `ApiError`, se enseña el mensaje del servidor ("Correo o contraseña incorrectos."). El `429` (demasiados intentos) tiene su mensaje propio, porque Laravel lo manda en inglés. Si no es un `ApiError`, es que no hay conexión con el servidor.

**Fichero:** `frontend/src/views/LoginView.jsx`

Cambian los `import`, la parte de arriba del componente (hasta el `return`) y dos detalles del HTML. El resto del HTML no se toca.

Parte de arriba, como debe quedar:

```jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/ApiError.js";
import { useAuth } from "../auth/ContextoAuth.jsx";
import "./LoginView.css";

export function LoginView() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!correo.trim() || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Introduce un correo electrónico válido.");
      return;
    }

    setEnviando(true);

    try {
      await iniciarSesion(correo.trim(), password);
      navegar("/");
    } catch (fallo) {
      if (fallo instanceof ApiError && fallo.status === 429) {
        setError("Demasiados intentos. Espera un minuto y vuelve a probar.");
      } else if (fallo instanceof ApiError) {
        setError(fallo.message);
      } else {
        setError("No se puede conectar con el servidor.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    // ...el HTML sigue igual que ahora, salvo los dos cambios de abajo
```

Los dos cambios dentro del HTML:

1. El botón de enviar:

```jsx
          <button type="submit" className="login-boton" disabled={enviando}>
            {enviando ? "Entrando..." : "Iniciar sesión"}
          </button>
```

2. El enlace del pie (`<a href>` pasa a `<Link>`, para no recargar la página entera):

```jsx
          <p>
            ¿Todavía no tienes una cuenta? <Link to="/registro">Regístrate</Link>
          </p>
```

---

## Paso 12 · Conectar `RegisterView`

**Qué hacemos.** Lo mismo que en el login, para el formulario de registro.

**Por qué, bloque a bloque.**

- Se añade una validación que faltaba: contraseña de **al menos 8 caracteres** (igual que el servidor, para avisar antes).
- Cuando el servidor responde `422`, trae un objeto `errors` con los fallos por campo (por ejemplo, "Ya existe una cuenta con ese correo."). `fallo.body` es ese JSON completo (por eso `AuthApi` lo guarda en el `ApiError`). Se muestra el primer mensaje.
- Se envía `confirmarPassword`, que `AuthApi.registro` convierte en `confirmar_password` para Laravel.

**Fichero:** `frontend/src/views/RegisterView.jsx`

Cambian los `import`, la parte de arriba y los mismos dos detalles del HTML. El resto del formulario no se toca.

Parte de arriba, como debe quedar:

```jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/ApiError.js";
import { useAuth } from "../auth/ContextoAuth.jsx";
import "./RegisterView.css";

export function RegisterView() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { registrarse } = useAuth();
  const navegar = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    // Comprobar campos obligatorios
    if (
      !nombre.trim() ||
      !apellidos.trim() ||
      !correo.trim() ||
      !password ||
      !confirmarPassword
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Validar formato del correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Introduce un correo electrónico válido.");
      return;
    }

    // Longitud mínima de la contraseña (igual que en el servidor)
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Comprobar coincidencia de contraseñas
    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);

    try {
      await registrarse({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim(),
        password,
        confirmarPassword,
      });
      navegar("/");
    } catch (fallo) {
      if (fallo instanceof ApiError && fallo.status === 429) {
        setError("Demasiados intentos. Espera un minuto y vuelve a probar.");
      } else if (fallo instanceof ApiError && fallo.body?.errors) {
        // Error de validación del servidor: se muestra el primer mensaje
        const primerosErrores = Object.values(fallo.body.errors)[0];
        setError(primerosErrores[0]);
      } else if (fallo instanceof ApiError) {
        setError(fallo.message);
      } else {
        setError("No se puede conectar con el servidor.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    // ...el HTML sigue igual que ahora, salvo los dos cambios de abajo
```

Los dos cambios dentro del HTML:

1. El botón de enviar:

```jsx
          <button type="submit" className="login-boton" disabled={enviando}>
            {enviando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
```

2. El enlace del pie:

```jsx
          <p>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
```

---

## Paso 13 · Cabecera de `InicioView` según haya sesión o no

**Qué hacemos.** En la cabecera, mostramos "Iniciar sesión / Crear cuenta" si no hay sesión, y el nombre con "Cerrar sesión" si la hay.

**Por qué.** Es la forma de ver que todo funciona y de poder cerrar sesión. Los enlaces pasan a `<Link>` para navegar sin recargar la página.

**Fichero:** `frontend/src/views/InicioView.jsx`

Arriba, junto a los otros `import`, añade dos líneas:

```jsx
import { Link } from "react-router-dom";
import { useAuth } from "../auth/ContextoAuth.jsx";
```

Dentro de `InicioView()`, justo después de `export function InicioView() {`, añade:

```jsx
  const { usuario, cerrarSesion } = useAuth();
```

Y sustituye el bloque `<nav className="inicio-accesos">...</nav>` por:

```jsx
        <nav className="inicio-accesos">
          {usuario ? (
            <>
              <span>Hola, {usuario.nombre}</span>

              <button
                type="button"
                className="inicio-boton-login"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="inicio-boton-login">
                Iniciar sesión
              </Link>

              <Link to="/registro" className="inicio-boton-registro">
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
```

Puede que el `<button>` se vea distinto del enlace con la clase `inicio-boton-login` (los botones traen estilo propio del navegador). Si es así, es un ajuste de `InicioView.css`, que corresponde a quien lleva el diseño.

Además, el logo `<a href="/">` puede pasar a `<Link to="/">` por la misma razón (no recargar).

---

## Paso 14 · Probar todo de punta a punta

**Qué hacemos.** Arrancamos el frontend y recorremos el flujo.

**Por qué.** Es la prueba real: formulario, API, base de datos y vuelta.

**Comando de consola** (desde `frontend`):

```bash
npm run dev
```

Abre la dirección que muestre (normalmente `http://localhost:5173`). Los contenedores del backend deben estar arrancados.

Casos que probar (apunta el resultado de cada uno para la memoria):

|Caso|Qué debe pasar|
|---|---|
|Clic en "Iniciar sesión" en la cabecera|Abre `/login` (no recarga el inicio)|
|Login con `admin@correo.es` y `password`|Vuelve al inicio y la cabecera muestra "Hola, Admin" y "Cerrar sesión"|
|Recargar la página (F5)|Sigue la sesión iniciada|
|"Cerrar sesión"|La cabecera vuelve a mostrar "Iniciar sesión" y "Crear cuenta"|
|Login con contraseña incorrecta|Muestra "Correo o contraseña incorrectos."|
|Login con un correo que no existe|Muestra el **mismo** mensaje|
|Registro con un correo ya existente (`admin@correo.es`)|Muestra "Ya existe una cuenta con ese correo."|
|Registro correcto con datos nuevos|Crea la cuenta, inicia sesión y vuelve al inicio|
|Abrir las herramientas del navegador (pestaña Red) durante el login|La respuesta lleva `token`, y la petición lleva el JSON con `correo_electronico` y `password`|

Comprobación en la base de datos del rol del usuario recién registrado (debe ser `usuario`). Desde `backend`; te pedirá la contraseña de MySQL (la de `DB_PASSWORD` en `backend/app/.env`):

```bash
docker compose exec db mysql -u sabitech_user -p sabitech -e "SELECT id, nombre, correo_electronico, rol FROM usuarios ORDER BY id DESC LIMIT 3;"
```

---

## Paso 15 · Avisar al equipo en `Pasos.md`

**Qué hacemos.** Añadimos una sección a `Sabitech docs/Pasos.md`.

**Por qué.** Tras el `git pull`, tus compañeros necesitan instalar la dependencia nueva del frontend y saber cómo probar. No hace falta tocar la base de datos: no hay migraciones nuevas.

**Fichero:** `Sabitech docs/Pasos.md`

Añade al final:

````markdown
**Autenticación (login, registro y logout)**
Después de actualizar el repositorio, en la carpeta `frontend` ejecutar:
```bash
npm install
```
(se ha añadido `react-router-dom`). No hay migraciones nuevas.

Cuentas de prueba (contraseña `password`): `admin@correo.es`, `ponente@correo.es`, `usuario@correo.es`.

Rutas nuevas de la API: `POST /api/registro`, `POST /api/login`, `POST /api/logout` y `GET /api/perfil`.
`GET /api/reservas` ahora exige token (cabecera `Authorization: Bearer <token>`).
El token caduca a las 6 horas.
````

Después, commit y push con un mensaje claro, por ejemplo: `Autenticación: AuthController, rutas protegidas, login y registro conectados`.

---

## Resultado esperado

Al terminar:

- El registro crea usuarios con rol `usuario` y devuelve un token; el login lo devuelve para cuentas válidas; el logout lo invalida.
- `/api/reservas` responde `401` sin token y los datos con token válido.
- El login se limita a 10 intentos por minuto por IP (`429`).
- En React, `/login` y `/registro` son pantallas reales, la sesión se mantiene al recargar y se borra al cerrar la pestaña o cerrar sesión.
- Los errores no revelan si un correo está registrado al hacer login.

## Pendiente después de esta guía

1. **Proteger `/api/usuarios`.** Ahora lista todos los usuarios y sus correos a cualquiera, y `InicioView` la usa para su lista de prueba. Hay que quitar esa lista de la página de inicio y dejar la ruta solo para administradores (con Policies).
2. **Policies por rol** (`usuario`, `administrador`, `ponente`, `supervisor`): quién puede ver y editar qué. Hace falta una cuenta `supervisor` de prueba en `UsuarioSeeder`.
3. **Token caducado en el frontend:** si el servidor responde `401` en cualquier llamada, la app debería limpiar la sesión y llevar al login. Ahora solo se limpia al pulsar "Cerrar sesión".
4. **Verificación del correo** (`correo_confirmado`), con Mailpit en desarrollo; el servicio de envío real sigue por decidir.
5. **Recuperar contraseña:** el formulario de login lo tenía previsto en la reunión del 2 de noviembre y no está en el diseño actual.
6. **Rutas protegidas en React** (por ejemplo, un componente que lleve a `/login` si no hay sesión), cuando haya pantallas que lo requieran (mis reservas, panel de administración).
7. **Centralizar `API_BASE_URL`** en un solo fichero y limpiar `src/api/UsuarioApi` (sin extensión).
8. **`Base_de_datos.md`:** cambiar los roles antiguos (`asistente`, `personal_acceso`) por los definitivos.
9. **En producción (Despliegue):** el servidor web que sirva React tendrá que redirigir cualquier ruta (`/login`, `/registro`) a `index.html`, porque ahora hay rutas en el navegador. Y usar HTTPS, porque el token viaja en las peticiones.