<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['nombre', 'apellidos', 'correo_electronico', 'password'])]
#[Hidden(['password'])]
class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    // Tabla de la base de datos que representa este modelo
    protected $table = 'usuarios';

    // Conversiones automáticas de tipos
    protected function casts(): array
    {
        return [
            'correo_confirmado' => 'datetime',
            'password' => 'hashed',
        ];
    }
}