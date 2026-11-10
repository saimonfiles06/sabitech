<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PruebaController extends Controller
{
    public function index(): JsonResponse
    {
        $prueba = DB::table('charlas')
        ->select(
            'id',
            'titulo',
            'resumen_contenido',
        )

        ->orderBy('id')
        ->get();

        return response()->json(['data' => $prueba,200]);
    }
}