{{date:2026-11-06}}

Adrian y David han tenido un problema en el cual en VScode sale como errores algunos comandos de Laravel.
El problema viene al clonar el repositorio, Joan es el que ha hecho la integración de Laravel en su ordenador, el si que tiene la carpeta /vendor falta la carpeta backend/app/vendor/.
Esa carpeta contiene Laravel y el resto de dependencias, y la extensión Intelephense de VS Code busca ahí clases como Migration, Schema y Blueprint. No se descarga con git pull porque está en el .gitignore, así que hay que generarla en cada copia del repositorio.

Comando para solucionarlo.
´´´bash
cd /Users/davidmartin/Projects/sabitech/backend/app
docker run --rm -v "$PWD":/app -w /app composer:2 composer install --ignore-platform-reqs
,,,
