<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 25);
            $table->string('apellidos', 50);
            $table->string('correo_electronico', 50)->unique();
            $table->string('password');
            $table->dateTime('fecha_alta');
            $table->enum('rol', ['usuario', 'administrador', 'ponente', 'supervisor']);
            $table->datetimes('correo_confirmado');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
