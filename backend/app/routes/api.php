<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CharlaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\AuthController;

// Rutas públicas
Route::get('/charlas', [CharlaController::class, 'index']);
Route::get('/usuarios', [UsuarioController::class, 'index']);

// Autentificación: con límite de 10 intentos por minuto
Route::post('/registro', [AuthController::class, 'registro'])->middleware('throttle:10,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

// Rutas que exigen un token válido
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/perfil', [AuthController::class, 'perfil']);
    Route::get('/perfil/{id}', [UsuarioController::class, 'idUsuario']);
    Route::get('/reservas', [ReservaController::class, 'index']);
});