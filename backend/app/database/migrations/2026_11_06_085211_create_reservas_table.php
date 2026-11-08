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
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios');
            $table->foreignId('charla_id')->constrained('charlas');
            $table->string('estado');
            $table->dateTime('creado_editado');
            $table->dateTime('correo_enviado_en');
            $table->dateTime('hora_entrada');
            $table->timestamps();

            // Restrigción de reserva unica.
            // Un usuario solo podrá reservar una vez la charla.
            $table->unique(['usuario_id', 'charla_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};
