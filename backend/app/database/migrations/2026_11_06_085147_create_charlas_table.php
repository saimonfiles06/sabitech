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
            $table->string('titulo');
            $table->enum('rama', ['Salud', 'Business', 'Tech']);
            $table->foreignId('ponente_id')->constrained('usuarios');
            $table->string('resumen_contenido')->nullable();
            $table->string('contenido');
            $table->string('url_imagen')->nullable();
            $table->foreignId('sala_id')->constrained('salas');
            $table->dateTime('fecha_hora_charla');
            $table->dateTime('fecha_hora_entrada');
            $table->dateTime('fecha_hora_fin');
            $table->integer('contador_+info');
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
