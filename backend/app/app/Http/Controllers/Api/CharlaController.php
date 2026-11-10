<?php
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CharlaController extends Controller
{
    public function index(): JsonResponse
    {
        $charlas = DB::table('charlas')
        ->join('usuarios', 'charlas.ponente_id', '=', 'usuarios.id')
        ->join('salas', 'charlas.sala_id', '=', 'salas.id')
        ->select(
            'charla.id',
            'charla.titulo',
            'charla.rama',
            'usuarios.nombre AS nombre_ponente',
            'usuarios.apellidos AS apellidos_ponente',
            'charla.resumen_contenido',
            'charla.contenido',
            'charla.url_imagen',
            'salas.nombre',
            'charla.fecha_charla',
            'charla.hora_entrada',
            'charla.hora_fin',
        )

        ->orderBy('id')
        ->get();

        return response()->json($charlas);

        // Respuesta JSON
        // ==============
        // id
        // titulo
        // rama
        // nombre_ponente
        // apellidos_ponente
        // resumen_contenido
        // url_imagen
        // nombre_sala
        // fecha_charla
        // hora_entrada
        // hora_fin
    }
}