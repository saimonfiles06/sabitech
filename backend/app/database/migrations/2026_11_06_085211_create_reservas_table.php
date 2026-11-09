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
            //Para el checkpoint el estado default será confirmada, 
            //pero en un futuro se cambiará a pendiente,
            // ya que el usuario tendrá que confirmar la reserva mediante un correo electrónico.
            $table->enum('estado', ['confirmada', 'cancelada'])->default('confirmada');
            $table->dateTime('correo_enviado_en')->nullable();
            $table->dateTime('hora_entrada')->nullable();
            $table->timestamps();

            // Restricción de reserva unica.
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
