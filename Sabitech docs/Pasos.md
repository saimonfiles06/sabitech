**Levantar la base de datos**
La base de datos de prueba está en seeder.
Está configurado para que cree 50 usuarios (1 administrador, 10 ponentes y 39 usuarios).
También da de alta 5 salas y 10 charlas en dos días sin solape temporal de salas.
Para añadir todos los datos en la tabla primero nos aseguramos que está vacía,
entramos desde terminal al directorio backend y ejecutamos
```bash
docker compose exec web php artisan migrate:fresh
```
Esto borra todas las tablas, quedan vacías y con los id empezando de nuevo en cero.

después ejecutamos
```bash
docker compose exec web php artisan migrate:fresh --seed
```
esto lanza DatabaseSeeder e inserta los datos.

Podemos hacer comprobaciones de que se ha insertado correctamente.
Este nos lista las charlas registradas.
```bash
docker compose exec db mysql -u sabitech_user -pAula_Sabitech_2026 sabitech -e " SELECT c.id, s.nombre AS sala, c.fecha_hora_charla AS inicio, c.fecha_hora_fin AS fin, c.titulo FROM charlas c JOIN salas s ON c.sala_id = s.id ORDER BY c.fecha_hora_charla, s.nombre;"
```

Con esté comprobamos que no hay charlas en la misma sala con los horarios solapados.
```bash
docker compose exec db mysql -u sabitech_user -pAula_Sabitech_2026 sabitech -e "
SELECT a.id, b.id
FROM charlas a JOIN charlas b
  ON a.sala_id = b.sala_id AND a.id < b.id
 AND a.fecha_hora_charla < b.fecha_hora_fin
 AND b.fecha_hora_charla < a.fecha_hora_fin;"
```

Y con este vemos el numero de usuarios con cada rol.
```bash
docker compose exec db mysql -u sabitech_user -pAula_Sabitech_2026 sabitech -e "SELECT rol, COUNT(*) FROM usuarios GROUP BY rol;"
```

**Instalación de Sanctum en el backend**
Esta parte solo lo hace uno, en este caso lo he hecho yo (David).

*No ejecuteis estos comandos*, hacen la primera instalación.
```bash
docker compose exec web php artisan install:api
```

Lo que tenéis que hacer es:
Actualizar el repositorio y después en el directorio de Backend ejecutar...
```bash
docker compose exec web composer install
docker compose exec web php artisan migrate
```

## Levantar tercer contenedor y vista en movil

**Primeros pasos**
- Por supuesto bajar el repositorio.
- Tener Docker abierto y tener los contenedores parados.
- Desde la carpeta backend ejecutar ```   docker compose up -d --build```

A partir de tener esto en funcionamiento ya no hay que ejecutar en consola el **npm run dev** para ver el front y tampoco hay que hacer el **npm install**

**Ver la pagina en el movi**
- Lo primero estar conectado con ordenador y movil en la misma red wifi.
- Luego averiguar la ip del ordenador
	- En win creo que era **ip addr**
	- En Mac es con **ipconfig getifaddr en0**
- Luego en el movil entrar a `http://IP_DEL_ORDENADOR:5173`

### Si no carga desde el móvil

| Síntoma                                 | Qué mirar                                                                                                                                                                                                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No carga nada                           | ¿Mac y móvil están en la **misma wifi**? Las redes de invitados, de empresas y de centros educativos suelen aislar los dispositivos entre sí; en ese caso no hay forma de que funcione, y hay que usar la wifi de casa o compartir internet del móvil al Mac |
| No carga y la wifi es correcta          | Cortafuegos de macOS: puede haber preguntado si permite conexiones entrantes a Docker y hay que aceptar (Ajustes del Sistema → Red → Cortafuegos)                                                                                                            |
| Sigue sin cargar                        | `docker compose ps` debe mostrar `0.0.0.0:5173->5173/tcp`. Si muestra `127.0.0.1`, el puerto sigue cerrado: Despues de la tabla se ve como solucionarlo.                                                                                                     |
| Funcionaba y deja de funcionar          | La IP del Mac cambia al reiniciar el router o cambiar de red: repite el comando de la IP                                                                                                                                                                     |
| La web carga pero faltan los datos      | La API se está llamando con `localhost`: revisa que los 5 ficheros del paso 4 usan `"/api/"`                                                                                                                                                                 |
| Los cambios de código no se ven         | `docker compose restart frontend`                                                                                                                                                                                                                            |
| Error de que el puerto 5173 está en uso | Hay un `npm run dev` abierto en otro terminal: páralo con Ctrl+C                                                                                                                                                                                             |

En el caso que `docker compose ps apunte a 127.0.0.1, ejecutar esta linea en terminal
```bash
IP_FRONTEND=0.0.0.0 docker compose up -d frontend
```
