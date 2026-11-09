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
            $table->string('nombre', 50);
            $table->string('apellidos', 50);
            $table->string('correo_electronico', 50)->unique();
            $table->string('password');
            //enum para que el rol solo pueda ser usuario, administrador, ponente o supervisor,
            //  por defecto será usuario
            $table->enum('rol', ['usuario', 'administrador', 'ponente', 'supervisor'])->default('usuario');
            $table->dateTime('correo_confirmado')->nullable();
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
