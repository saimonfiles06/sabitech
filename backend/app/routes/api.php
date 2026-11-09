<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PruebaController;


Route::get('/charlas', [PruebaController::class, 'index']);