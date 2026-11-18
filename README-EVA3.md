# Rey del Balón - EVA3

Proyecto de tienda deportiva desarrollado con:

- Frontend: React + Vite
- Backend: Java 21 + Spring Boot + Maven
- Base de datos: MySQL 8

## Rama de desarrollo

La EVA3 se desarrolla en `desarrollo-eva3`.

La rama `main` se mantiene separada hasta la entrega final.

## Estructura

- `frontend/`: aplicación React
- `backend/`: API REST Spring Boot
- `database/rey_del_balon.sql`: base de datos

## 1. Importar MySQL

1. Abrir MySQL Workbench.
2. Conectarse al servidor MySQL local.
3. Abrir `database/rey_del_balon.sql`.
4. Ejecutar el script completo.
5. Verificar que exista la base `rey_del_balon`.

El script contiene las seis tablas, siete categorías,
42 productos y 135 registros de stock por talla.

## 2. Configurar el backend

Requisitos: Java 21 y MySQL 8.

En `backend/src/main/resources/`, copiar:

`application.properties.example`

y renombrar la copia como:

`application.properties`

No subir este último archivo a GitHub.

Configurar las variables de entorno DB_USER y DB_PASSWORD
con las credenciales locales de MySQL.

En PowerShell, desde la carpeta `backend`:

    $env:DB_USER = "root"
    $env:DB_PASSWORD = Read-Host "Clave MySQL"
    .\mvnw.cmd spring-boot:run

API disponible en:

http://localhost:8080/api/v1/productos

http://localhost:8080/api/v1/categorias

http://localhost:8080/api/v1/productos/1/tallas

## 3. Ejecutar el frontend

Requisitos: Node.js y npm compatibles con Vite.

En otra terminal, desde `frontend`:

    npm ci
    npm run dev

Abrir:

http://localhost:5173

## 4. Estado actual de la EVA3

Implementado:
- Entidades y repositorios JPA.
- API de consulta de productos y categorías.
- API de stock por talla.
- Catálogo React integrado con MySQL.
- Validación de cantidades en el carrito.
- Servicio Java para registrar compras (compilado).

Pendiente:
- Publicar y probar el endpoint de compras.
- Integrar el checkout con la API.
- CRUD administrativo completo.
- Autenticación y autorización.
- Pruebas finales y documentación API.

IMPORTANTE: El pago actual es una simulación académica.
No existe integración con una pasarela real.
