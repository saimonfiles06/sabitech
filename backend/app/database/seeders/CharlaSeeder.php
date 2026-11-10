<?php

namespace Database\Seeders;

use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CharlaSeeder extends Seeder
{
    public function run(): void
    {
        // Ids de los 10 ponentes y de las 5 salas, en orden de creación
        $ponentes = DB::table('usuarios')->where('rol', 'ponente')->orderBy('id')->pluck('id');
        $salas    = DB::table('salas')->orderBy('id')->pluck('id');

        // Días de las jornadas
        $dias = [
            1 => '2026-12-01',
            2 => '2026-12-02',
        ];

        // Posición de cada sala en $salas (mismo orden que en SalaSeeder)
        $auditorio     = 0;
        $conferencias  = 1;
        $aula1         = 2;
        $aula2         = 3;
        $reuniones     = 4;

        $charlas = [
            // ---------- Día 1 ----------
            [
                'dia'  => 1,
                'sala' => $auditorio,
                'rama' => 'Tech',
                'titulo' => 'IA generativa en el desarrollo web',
                'resumen_contenido' => 'Cómo las herramientas de IA generativa están cambiando la forma de programar, y qué tareas conviene delegarles y cuáles no.',
                'contenido' => 'Recorrido práctico por asistentes de código basados en IA: generación de componentes, pruebas automáticas y documentación. Veremos ejemplos reales, los errores más habituales que cometen estas herramientas y cómo revisar su trabajo antes de llevarlo a producción.',
            ],
            [
                'dia'  => 1,
                'sala' => $auditorio,
                'rama' => 'Business',
                'titulo' => 'Cómo validar una idea de negocio digital',
                'resumen_contenido' => 'Métodos sencillos para comprobar si una idea tiene clientes antes de invertir tiempo y dinero en desarrollarla.',
                'contenido' => 'Aprenderás a definir una propuesta de valor, a identificar a tus primeros clientes y a construir un producto mínimo viable para contrastar la idea. Analizaremos casos de startups que pivotaron a tiempo y otras que no supieron escuchar al mercado.',
            ],
            [
                'dia'  => 1,
                'sala' => $conferencias,
                'rama' => 'Salud',
                'titulo' => 'Telemedicina: la consulta médica del futuro',
                'resumen_contenido' => 'Qué tecnologías hacen posible la atención sanitaria a distancia y qué retos plantea para pacientes y profesionales.',
                'contenido' => 'Repasaremos las plataformas de videoconsulta, el seguimiento remoto de pacientes crónicos y la receta electrónica. También hablaremos de la brecha digital, la privacidad de los datos clínicos y la experiencia de los profesionales sanitarios que ya trabajan así.',
            ],
            [
                'dia'  => 1,
                'sala' => $conferencias,
                'rama' => 'Tech',
                'titulo' => 'Ciberseguridad básica para tus aplicaciones',
                'resumen_contenido' => 'Las vulnerabilidades más comunes en aplicaciones web y las medidas mínimas para protegerse de ellas.',
                'contenido' => 'Explicaremos con ejemplos ataques como la inyección SQL, el XSS o el robo de sesiones, y cómo los frameworks modernos ayudan a evitarlos. Terminaremos con una lista de comprobaciones de seguridad que cualquier equipo puede aplicar antes de publicar su aplicación.',
            ],
            [
                'dia'  => 1,
                'sala' => $reuniones,
                'rama' => 'Salud',
                'titulo' => 'Apps de salud y protección de datos',
                'resumen_contenido' => 'Qué datos recogen las aplicaciones de salud, quién puede acceder a ellos y qué dice la normativa europea.',
                'contenido' => 'Sesión reducida y participativa sobre el RGPD aplicado a las apps de salud y bienestar. Analizaremos permisos, consentimiento y almacenamiento de datos sensibles, y revisaremos entre todos la política de privacidad de varias aplicaciones conocidas.',
            ],

            // ---------- Día 2 ----------
            [
                'dia'  => 2,
                'sala' => $auditorio,
                'rama' => 'Tech',
                'titulo' => 'Del código a producción con Docker',
                'resumen_contenido' => 'Cómo los contenedores permiten que una aplicación funcione igual en el portátil del desarrollador y en el servidor.',
                'contenido' => 'Partiremos de una aplicación web sencilla y la llevaremos paso a paso a contenedores con Docker y Docker Compose: servidor web, base de datos y servicios auxiliares. Veremos buenas prácticas para variables de entorno, volúmenes y despliegue.',
            ],
            [
                'dia'  => 2,
                'sala' => $auditorio,
                'rama' => 'Business',
                'titulo' => 'Marketing digital para startups tecnológicas',
                'resumen_contenido' => 'Estrategias de bajo coste para dar a conocer un producto tecnológico y conseguir los primeros usuarios.',
                'contenido' => 'Trabajaremos el posicionamiento en buscadores, el marketing de contenidos y las redes sociales profesionales. Veremos cómo medir los resultados con métricas sencillas y cómo ajustar la estrategia sin un gran presupuesto.',
            ],
            [
                'dia'  => 2,
                'sala' => $aula1,
                'rama' => 'Salud',
                'titulo' => 'Wearables: datos que cuidan tu salud',
                'resumen_contenido' => 'Relojes inteligentes, pulseras y sensores: qué miden realmente y cómo pueden ayudar a la prevención.',
                'contenido' => 'Analizaremos la fiabilidad de los datos que recogen los dispositivos que llevamos puestos, como el ritmo cardiaco, el sueño o la actividad física. Hablaremos de su uso en la prevención y en estudios clínicos, y de sus límites frente a un diagnóstico médico.',
            ],
            [
                'dia'  => 2,
                'sala' => $aula2,
                'rama' => 'Business',
                'titulo' => 'Financiación para emprendedores tecnológicos',
                'resumen_contenido' => 'Desde ayudas públicas hasta inversores privados: opciones para financiar un proyecto tecnológico en sus primeras fases.',
                'contenido' => 'Repasaremos las subvenciones y préstamos públicos para emprendedores, las aceleradoras, el crowdfunding y los business angels. Veremos qué espera cada tipo de inversor y cómo preparar un plan de negocio y una presentación convincentes.',
            ],
            [
                'dia'  => 2,
                'sala' => $aula2,
                'rama' => 'Tech',
                'titulo' => 'Accesibilidad web: diseñar para todos',
                'resumen_contenido' => 'Por qué la accesibilidad es obligatoria y cómo aplicar las pautas básicas en cualquier proyecto web.',
                'contenido' => 'Veremos las pautas WCAG con ejemplos: contraste, navegación por teclado, etiquetas en formularios y textos alternativos. Probaremos una web con un lector de pantalla y repasaremos herramientas gratuitas para detectar problemas de accesibilidad.',
            ],
        ];

        // Hora a la que queda libre cada sala cada día (se va rellenando)
        $salaLibreDesde = [];

        $filas = [];

        foreach ($charlas as $indice => $charla) {
            $salaId = $salas[$charla['sala']];
            $clave  = $charla['dia'] . '-' . $salaId;

            // Si la sala no se ha usado aún ese día, la charla empieza a las 9:30
            $inicio = $salaLibreDesde[$clave]
                ?? CarbonImmutable::parse($dias[$charla['dia']] . ' 09:30');

            // Duración aleatoria: 1 hora o 1 hora y media
            $duracion = fake()->randomElement([60, 90]);
            $fin      = $inicio->addMinutes($duracion);

            // La sala vuelve a estar libre 30 minutos después de terminar
            $salaLibreDesde[$clave] = $fin->addMinutes(30);

            $filas[] = [
                'titulo'             => $charla['titulo'],
                'rama'               => $charla['rama'],
                'ponente_id'         => $ponentes[$indice],
                'resumen_contenido'  => $charla['resumen_contenido'],
                'contenido'          => $charla['contenido'],
                'url_imagen'         => null,
                'sala_id'            => $salaId,
                'fecha_hora_charla'  => $inicio,
                'fecha_hora_entrada' => $inicio->subMinutes(15),
                'fecha_hora_fin'     => $fin,
                'created_at'         => now(),
                'updated_at'         => now(),
            ];
        }

        DB::table('charlas')->insert($filas);
    }
}