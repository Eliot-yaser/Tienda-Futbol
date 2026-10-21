# ⚽ Rey del Balón

## Evaluación Parcial 2 - Desarrollo Fullstack II

**Institución:** Duoc UC  
**Asignatura:** Desarrollo Fullstack II (DSY1104)  
**Proyecto:** Rey del Balón - Tienda de artículos deportivos  
**Integrantes:** Eliot Armijo e Isaac Arias

---

## 📋 Descripción del proyecto

Rey del Balón es una aplicación web de comercio electrónico especializada en artículos de fútbol.

El proyecto fue desarrollado utilizando React, JavaScript, Vite y Bootstrap, implementando componentes reutilizables, navegación dinámica, administración de productos y simulación de compras.

Esta versión corresponde a la segunda evaluación de Desarrollo Fullstack II.

## 🚀 Tecnologías utilizadas

- React
- JavaScript
- HTML5 y CSS3
- Bootstrap 5
- Vite
- React Router
- Git y GitHub
- GitHub Pages
- Jasmine y Karma

## 🛒 Funcionalidades principales

### Tienda
- Página de inicio.
- Catálogo de productos.
- Filtrado por categorías.
- Sección de ofertas.
- Visualización del detalle de productos.
- Carrito de compras.
- Modificación de cantidades.
- Validación de stock.
- Simulación de compras.

### Usuarios
- Registro de usuarios.
- Inicio y cierre de sesión.
- Manejo de sesiones mediante almacenamiento local.
- Roles de administrador, vendedor y cliente.
- Rutas protegidas según el rol.

### Administración
- Gestión de productos.
- Operaciones CRUD.
- Administración de usuarios.
- Control de inventario.
- Consulta de ventas.
- Panel administrativo.

### Otras páginas
- Nosotros.
- Contacto.
- Blog.

## 🧩 Arquitectura del proyecto

La aplicación utiliza componentes React reutilizables.

Se implementan:
- Componentes funcionales.
- Props.
- Estados mediante useState.
- Efectos mediante useEffect.
- Navegación con React Router.
- Hooks personalizados.
- Diseño adaptable con Bootstrap.

## 📁 Estructura principal

Tienda-Futbol/
│
├── .github/
│   └── workflows/
│       └── publicar-pages.yml
│
├── frontend/
│   ├── evidencias/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── tests/
│   │   └── utils/
│   ├── index.html
│   ├── karma.conf.cjs
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── README.md

## 💻 Instalación y ejecución

Para ejecutar el proyecto localmente, se requiere Node.js y npm.

Clonar el repositorio:

    git clone https://github.com/Eliot-yaser/Tienda-Futbol.git

Ingresar al proyecto:

    cd Tienda-Futbol/frontend

Instalar dependencias:

    npm install

Iniciar el servidor de desarrollo:

    npm run dev

Abrir en el navegador la dirección local indicada por Vite.

Para generar la versión de producción:

    npm run build

## 🧪 Pruebas unitarias

El proyecto incorpora pruebas automatizadas utilizando Jasmine y Karma.

Las pruebas se encuentran en:

`frontend/src/tests/`

Archivo de configuración:

`frontend/karma.conf.cjs`

Para ejecutar las pruebas desde la carpeta frontend:

    npx karma start karma.conf.cjs

Las pruebas están configuradas para ejecutarse con ChromeHeadless y generar informes de cobertura.

## 💾 Persistencia de datos

La aplicación utiliza localStorage para almacenar información de demostración, incluyendo usuarios, productos, inventario, carrito e historial de ventas.

Las compras son simuladas y no se realizan transacciones reales.

Esta versión corresponde a una implementación frontend y no utiliza una base de datos ni un backend de producción.

## 🌐 Publicación

La aplicación está publicada mediante GitHub Pages.

**Sitio web:**

https://eliot-yaser.github.io/Tienda-Futbol/

**Repositorio:**

https://github.com/Eliot-yaser/Tienda-Futbol

La publicación se realiza automáticamente mediante GitHub Actions desde la rama main.

## 🎓 Objetivo académico

Aplicar los conocimientos adquiridos en Desarrollo Fullstack II mediante la construcción de una aplicación web con React.

El proyecto demuestra el uso de componentes, props, estados, navegación, operaciones CRUD, persistencia local, diseño responsivo y pruebas automatizadas.

---

**Duoc UC | Desarrollo Fullstack II | Evaluación Parcial 2**
