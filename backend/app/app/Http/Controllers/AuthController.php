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