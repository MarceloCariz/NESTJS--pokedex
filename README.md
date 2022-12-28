<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio

2. Ejecutar

```
yarn install / npm install
```

3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker-compose up -d
```

5. Clonar el archivo _.env.template_ y renombrar la copia a __.env.__


6. LLenar las variables de entorno definidas en el ```.env```

7. Ejecutar la aplicacion en dev:
```
yarn start:dev
```

8. Reconstruir la base de datos con la semilla [GET]
```
http://localhost:3000/api/v2/seed
```

## Stack usado
* Nest js
* Mongo db

# Production Build
1. Crear el archivo ```.env.prod```
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```