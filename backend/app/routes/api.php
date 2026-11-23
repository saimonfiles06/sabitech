<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CharlaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\AuthController;

// Rutas públicas
Route::get('/charlas', [CharlaController::class, 'index']);
Route::get('/charlas/{charlaId}', [CharlaController::class, 'idCharla'])->whereNumber('charlaId');

// Autentificación: con límite de 10 intentos por minuto
Route::post('/registro', [AuthController::class, 'registro'])->middleware('throttle:10,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

// Rutas que exigen un token válido
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Rutas usuario
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::get('/usuarios/{usuarioId}', [UsuarioController::class, 'idUsuario'])->whereNumber('usuarioId');
    Route::put('/usuarios/{usuarioId}', [UsuarioController::class, 'actualizaUsuario'])->whereNumber('usuarioId');
    Route::delete('/usuarios/{usuarioId}', [UsuarioController::class, 'borraUsuario'])->whereNumber('usuarioId');
    
    //Rutas reservas
    Route::get('/reservas', [ReservaController::class, 'index']);
    Route::post('/reservas', [ReservaController::class, 'reservar']);
    Route::get('/usuarios/{usuarioId}/reservas', [ReservaController::class, 'reservasUsuario'])->whereNumber('usuarioId');
    Route::get('/charlas/{charlaId}/reservas', [ReservaController::class, 'reservasCharla'])->whereNumber('charlaId');
    Route::put('/reservas/{reservaId}', [ReservaController::class, 'modificaReserva'])->whereNumber('reservaId');
    Route::delete('/reservas/{reservaId}', [ReservaController::class, 'borraReserva'])->whereNumber('reservaId');

    //Rutas charlas
    Route::post('/charlas', [CharlaController::class, 'creaCharla']);
    Route::put('/charlas/{charlaId}', [CharlaController::class, 'modificaCharla'])->whereNumber('charlaId');
    Route::delete('/charlas/{charlaId}', [CharlaController::class, 'borraCharla'])->whereNumber('charlaId');

});