# Prueba tecnica

### Pre-requisitos

- Tener instalado [Git](https://git-scm.com/downloads)
- Tener instalado [Docker](https://www.docker.com/get-started/)

##### Para iniciar el proyecto es necesario:

- Clonar este repositorio
- Renombrar el archivo .env.example y agregar un valor adecuado a los datos faltantes
- Ubicarse en la carpeta raiz
- Ejecutar:

```
docker-compose up --build
```

### Ejecutar tests

npm test

### Swagger

Ruta basada en el archivo .env por defecto podra acceder desde 127.0.0.1:3000

Las demas rutas son: 
- /api/v1 
- /api/v1/register 
- /api/v1/login

### Postman

- Seleccionar Import en la sidebar
- Seleccionar el archivo collection en el repositorio
- Darle import
