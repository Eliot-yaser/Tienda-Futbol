// Base de datos de productos actualizada
const productosBase = [
    {
        codigo: "CAM-001",
        nombre: "Camiseta Selección Chilena 2026",
        descripcion: "Camiseta oficial de La Roja versión local con tecnología AEROREADY de absorción de humedad.",
        precio: 59990,
        stock: 25,
        stockCritico: 5,
        categoria: "Camisetas",
        imagen: "https://www.lacabala.cl/cdn/shop/files/99f822ae.jpg?v=1780623347&width=600"
    },
    {
        codigo: "CAM-002",
        nombre: "Camiseta Selección de Alemania 2026",
        descripcion: "Camiseta oficial de la Die Mannschaft versión local, tejido de alto rendimiento con detalles icónicos.",
        precio: 64990,
        stock: 20,
        stockCritico: 4,
        categoria: "Camisetas",
        imagen: "https://gravitshop.cl/cdn/shop/files/1b07a787_jpg_7f9d6d12-44b4-4888-bd44-7f7a1de04dd9.webp?v=1784734431"
    },
    {
        codigo: "CAM-003",
        nombre: "Camiseta Selección de Francia 2026",
        descripcion: "Indumentaria oficial de Les Bleus versión local, ligera y transpirable para máximo rendimiento.",
        precio: 64990,
        stock: 18,
        stockCritico: 3,
        categoria: "Camisetas",
        imagen: "https://gravitshop.cl/cdn/shop/files/francia-visitante-26-27-player-1.jpg?v=1785864791"
    },
    {
        codigo: "CAM-004",
        nombre: "Camiseta Selección de Portugal 2026",
        descripcion: "Camiseta oficial de la selección portuguesa con acabado clásico en rojo burdeos y detalles dorados.",
        precio: 64990,
        stock: 15,
        stockCritico: 3,
        categoria: "Camisetas",
        imagen: "https://gravitshop.cl/cdn/shop/files/6d945c1f_jpg.webp?v=1784734431"
    },
    {
        codigo: "CAM-005",
        nombre: "Camiseta Colo-Colo Oficial 2026",
        descripcion: "Camiseta oficial del Eterno Campeón versión local, diseño clásico en blanco y negro.",
        precio: 54990,
        stock: 30,
        stockCritico: 5,
        categoria: "Camisetas",
        imagen: "https://www.lacabala.cl/cdn/shop/files/7e7ee4f4.jpg?v=1780623210"
    },
    {
        codigo: "CAM-006",
        nombre: "Camiseta Real Madrid Local 2026",
        descripcion: "Camiseta oficial del cuadro merengue, blanca clásica con detalles en color oro.",
        precio: 69990,
        stock: 22,
        stockCritico: 4,
        categoria: "Camisetas",
        imagen: "https://static.wixstatic.com/media/d48029_599e48866d2c45bfb25a34fa7c33ff69~mv2.jpg/v1/fill/w_480,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/d48029_599e48866d2c45bfb25a34fa7c33ff69~mv2.jpg"
    },
    {
        codigo: "BOT-001",
        nombre: "Botines Mercurial Superfly",
        descripcion: "Zapatillas de fútbol para césped natural con ajuste anatómico y agarre profesional.",
        precio: 129990,
        stock: 10,
        stockCritico: 2,
        categoria: "Calzado",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfXVa5khfe1sX16w0Lak6xTSRrPD4cPTrhGWxt4s0HNp2ZcmkrIadaHin6&s=10"
    },
    {
        codigo: "BAL-001",
        nombre: "Balón Oficial Champions League",
        descripcion: "Balón de alta resistencia con tecnología de sellado térmico y certificación FIFA Quality Pro.",
        precio: 34990,
        stock: 40,
        stockCritico: 8,
        categoria: "Accesorios",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWjVYhzXHV8AUyTkA-POP6kOzEgd8qq-GCYBH2gUzojZ0w1DTS9Bp5W6pf&s=10"
    },
    {
        codigo: "GUA-001",
        nombre: "Guantes de Arquero Pro Grip",
        descripcion: "Guantes de arquero con látex de alto agarre y varillas de protección en los dedos.",
        precio: 29990,
        stock: 15,
        stockCritico: 3,
        categoria: "Accesorios",
        imagen: "https://nikeclprod.vtexassets.com/arquivos/ids/1102460/HQ0258_010_A_PREM.jpg?v=638635075418170000"
    }
];

// Reemplaza la lista en el almacenamiento local para sincronizar los nuevos productos
localStorage.setItem('productos', JSON.stringify(productosBase));