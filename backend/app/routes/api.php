<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PruebaController;
use App\Http\Controllers\CharlaController;
use App\Http\Controllers\UsuarioController;

Route::get('/prueba', [PruebaController::class, 'index']);
Route::get('/charlas', [CharlaController::class, 'index']);
Route::get('/usuarios', [UsuarioController::class, 'index']);