<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Nette\Schema\Message;

class CharlaController extends Controller
{
    //Listado completo de charlas (todos los datos) Para todos los publicos.
    public function index(Request $peticion): JsonResponse
    {
        // Filtro opcional por rama: /api/charlas?rama=Tech
        $datos = $peticion->validate(
            ['rama' => ['nullable', 'in:Salud,Business,Tech']],
            ['rama.in' => 'La rama debe ser Salud, Business o Tech.']
        );
        $rama = $datos['rama'] ?? null;

        // Subconsulta: reservas confirmadas de cada charla
        $reservasConfirmadas = DB::table('reservas')
            ->selectRaw('COUNT(*)')
            ->whereColumn('reservas.charla_id', 'charlas.id')
            ->where('reservas.estado', 'confirmada');

        $charlas = DB::table('charlas')
            ->join('usuarios AS ponente', 'charlas.ponente_id', '=', 'ponente.id')
            ->leftJoinjoin('usuarios AS supervisor', 'charlas.supervisor_id', '=', 'supervisor.id')
            ->join('salas', 'charlas.sala_id', '=', 'salas.id')
            ->select(
                'charlas.id',
                'charlas.titulo',
                'charlas.rama',
                'ponente.nombre AS nombre_ponente',
                'ponente.apellidos AS apellidos_ponente',
                'supervisor.nombre AS nombre_supervisor',
                'supervisor.apellidos AS apellidos_supervisor',
                'charlas.resumen_contenido',
                'charlas.contenido',
                'charlas.url_imagen',
                'salas.nombre AS nombre_sala',
                'salas.aforo',
                'charlas.fecha_hora_charla',
                'charlas.fecha_hora_entrada',
                'charlas.fecha_hora_fin',
            )
            ->selectSub($reservasConfirmadas, 'plazas_ocupadas') //Añadimos el dato de plazas ocupadas de la Subconsulta.
            ->where('estado', 'activa')
            ->when($rama, function ($consulta) use ($rama) {
                $consulta->where('charlas.rama', $rama);
            })
            ->orderBy('fecha_hora_charla')
            ->get();

        // Plazas libres de cada charla
        foreach ($charlas as $charla) {
            $charla->plazas_libres = max(0, $charla->aforo - $charla->plazas_ocupadas);
        }

        return response()->json($charlas, 200);

        // Respuesta JSON
        // ==============
        // id
        // titulo
        // rama
        // nombre_ponente
        // apellidos_ponente
        // nombre_supervisor
        // apellidos_supervisor
        // resumen_contenido
        // contenido
        // url_imagen
        // nombre_sala
        // fecha_charla
        // hora_entrada
        // hora_fin
    }
    
    //Obtener charla por id
    public function idCharla(int $idCharla): JsonResponse
    {
        // Subconsulta: reservas confirmadas de cada charla
        $reservasConfirmadas = DB::table('reservas')
            ->selectRaw('COUNT(*)')
            ->whereColumn('reservas.charla_id', 'charlas.id')
            ->where('reservas.estado', 'confirmada');

        $charla = DB::table('charlas')
            ->join('usuarios AS ponente', 'charlas.ponente_id', '=', 'ponente.id')
            ->leftJoinjoin('usuarios AS supervisor', 'charlas.supervisor_id', '=', 'supervisor.id')
            ->join('salas', 'charlas.sala_id', '=', 'salas.id')
            ->select(
                'charlas.id',
                'charlas.titulo',
                'charlas.rama',
                'ponente.nombre AS nombre_ponente',
                'ponente.apellidos AS apellidos_ponente',
                'supervisor.nombre AS nombre_supervisor',
                'supervisor.apellidos AS apellidos_supervisor',
                'charlas.resumen_contenido',
                'charlas.contenido',
                'charlas.url_imagen',
                'salas.nombre AS nombre_sala',
                'salas.aforo',
                'charlas.fecha_hora_charla',
                'charlas.fecha_hora_entrada',
                'charlas.fecha_hora_fin',
            )
            ->selectSub($reservasConfirmadas, 'plazas_ocupadas') //Añadimos el dato de plazas ocupadas de la Subconsulta.
            ->where('charlas.id', $idCharla)
            ->first();

            if(!$charla){
                return response()->json(['mensaje' => 'La charla no existe.'], 404);
            }

        // Plazas libres de la charla
            $charla->plazas_libres = max(0, $charla->aforo - $charla->plazas_ocupadas);
        
        return response()->json($charla, 200);
    }

    //Crear nueva charla POST /api/charlas
    public function creaCharla(Request $peticion): JsonResponse
    {
        // Permiso: solo el administrador
    if ($peticion->user()->rol !== 'administrador') {
        return response()->json(['mensaje' => 'No tienes permiso.'], 403);
    }

    $datos = $peticion->validate([
        'sala_id'            => ['required', 'exists:salas,id'],
        'ponente_id'         => ['nullable', Rule::exists('usuarios', 'id')->where('rol', 'ponente')],
        'supervisor_id'      => ['nullable', Rule::exists('usuarios', 'id')->where('rol', 'supervisor')],
        'titulo'             => ['required', 'string', 'max:100'],
        'rama'               => ['required', 'string', 'max:50'],
        'resumen_contenido'  => ['required', 'string'],
        'contenido'          => ['required', 'string'],
        'url_imagen'         => ['nullable', 'string'],
        'fecha_hora_charla'  => ['required', 'date'],
        'fecha_hora_entrada' => ['required', 'date', 'before_or_equal:fecha_hora_charla'],
        'fecha_hora_fin'     => ['required', 'date', 'after:fecha_hora_charla'],
    ]);

    // insertGetId guarda la fila y devuelve el id nuevo
    $idCharla = DB::table('charlas')->insertGetId($datos);

    return response()->json(['id' => $idCharla], 201);
    }

    //Modifica charla
    public function modificaCharla(int $idCharla): JsonResponse
    {
        // TODO
        return response()->json(['message' => 'Pendiente de implementar.'], 501);
    }

    //Elimina charla
    public function borraCharla(int $idCharla): JsonResponse
    {
        // TODO
        return response()->json(['message' => 'Pendiente de implementar.'], 501);
    }
}
