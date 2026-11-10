<?php
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class UsuarioController extends Controller
{
    public function index(): JsonResponse
    {
        $usuarios = DB::table('usuarios')
        ->select(
            'id',
            'nombre',
            'apellidos',
            'correo_electronico',
            'rol',
            'correo_confirmado',
            'created_at'
        )

        ->orderBy('id')
        ->get();

        return response()->json($usuarios, 200);

        // Respuesta JSON
        // ==============
        // id
        // nombre
        // apellidos
        // correo_electronico
        // rol
        // correo_confirmado
        // fecha_alta
    }
}