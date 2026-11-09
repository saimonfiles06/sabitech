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
        Schema::create('charlas', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 80);
            $table->enum('rama', ['Salud', 'Business', 'Tech']);
            $table->foreignId('ponente_id')->constrained('usuarios');
            $table->string('resumen_contenido')->nullable();
            $table->text('contenido'); // Se configura como text para que pueda contener más de 255 caracteres
            $table->string('url_imagen')->nullable();
            $table->foreignId('sala_id')->constrained('salas');
            $table->dateTime('fecha_hora_charla');
            $table->dateTime('fecha_hora_entrada');
            $table->dateTime('fecha_hora_fin');
            $table->unsignedInteger('contador_+info')->default(0);
            //Campo estado para indicar si la charla está
            // activa, en edición, finalizada o cancelada,
            // por defecto será activa
            $table->enum('estado', ['activa', 'en_edicion', 'finalizada', 'cancelada'])->default('activa');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('charlas');
    }
};
