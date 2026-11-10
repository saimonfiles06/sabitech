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
