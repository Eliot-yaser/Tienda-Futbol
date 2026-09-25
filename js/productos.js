// Base de datos de productos
const productosBase = [

    // ==========================================
    // CAMISETAS
    // ==========================================

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

    // ==========================================
    // SHORTS
    // ==========================================

    {
        codigo: "SHO-001",
        nombre: "Short Selección Chilena 2026",
        descripcion: "Short oficial de la Selección Chilena diseñado para complementar la camiseta local.",
        precio: 29990,
        stock: 20,
        stockCritico: 4,
        categoria: "Shorts",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlSpl0FdInxZEZiqXAxNcr4EHpXnp9TybAOo_APNmo5A&s=10"
    },
    {
        codigo: "SHO-002",
        nombre: "Short Selección de Alemania 2026",
        descripcion: "Short oficial de Alemania confeccionado con tejido deportivo ligero y transpirable.",
        precio: 32990,
        stock: 18,
        stockCritico: 3,
        categoria: "Shorts",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS16jMZeVo8R3YnZoKRDq9E9oA1XlvfzcpmXCCZFw_Ntw&s=10"
    },
    {
        codigo: "SHO-003",
        nombre: "Short Selección de Francia 2026",
        descripcion: "Short oficial de Francia con ajuste cómodo para entrenamiento y uso deportivo.",
        precio: 32990,
        stock: 18,
        stockCritico: 3,
        categoria: "Shorts",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT4w408Z9OKulMNFyBMarjq-fm9d0R4smO9Hz8sAe0Zw&s=10"
    },
    {
        codigo: "SHO-004",
        nombre: "Short Selección de Portugal 2026",
        descripcion: "Short oficial de Portugal con diseño deportivo y tecnología de secado rápido.",
        precio: 32990,
        stock: 16,
        stockCritico: 3,
        categoria: "Shorts",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZoru2S0EuDd2UFrr-60IsBnbM_fO3XUZ57dyQMeP3kw&s=10"
    },
    {
        codigo: "SHO-005",
        nombre: "Short Colo-Colo Oficial 2026",
        descripcion: "Short oficial de Colo-Colo ideal para complementar la indumentaria del club.",
        precio: 28990,
        stock: 22,
        stockCritico: 4,
        categoria: "Shorts",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMNjC0IhU2lD8Xh34LqCSlZw_zmGVstUQwioo7sf1GOA&s=10"
    },
    {
        codigo: "SHO-006",
        nombre: "Short Real Madrid Local 2026",
        descripcion: "Short oficial del Real Madrid confeccionado para entregar comodidad y libertad de movimiento.",
        precio: 34990,
        stock: 20,
        stockCritico: 4,
        categoria: "Shorts",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTTOvdEuGFCR0pm85oo7TDMmPXd8HcDVUXXMSFE86Dzw&s=10"
    },

    // ==========================================
    // BOTINES / CALZADO
    // ==========================================

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
        codigo: "BOT-002",
        nombre: "Botines Phantom GX",
        descripcion: "Botines diseñados para mejorar el control del balón y la precisión durante el juego.",
        precio: 119990,
        stock: 12,
        stockCritico: 2,
        categoria: "Calzado",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLUHFiZWTpbtO4e01BUl27uJxXyoBdM9tGbcFEdXdL1Q&s=10"
    },
    {
        codigo: "BOT-003",
        nombre: "Botines Predator Elite",
        descripcion: "Botines de fútbol con superficie de control optimizada para pases y remates precisos.",
        precio: 139990,
        stock: 9,
        stockCritico: 2,
        categoria: "Calzado",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2vrimoe3AZyQj8RuwNmrVdCg2QwKt-0gdY9fFiGKGfw&s=10"
    },
    {
        codigo: "BOT-004",
        nombre: "Botines Copa Pure",
        descripcion: "Botines con diseño clásico y ajuste cómodo para jugadores que buscan mayor sensibilidad con el balón.",
        precio: 109990,
        stock: 14,
        stockCritico: 3,
        categoria: "Calzado",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThVyvkZOBL6Qni3f6uQ6Cfw775SGtKdbTbCFIHJl-gOA&s=10"
    },
    {
        codigo: "BOT-005",
        nombre: "Botines Future Ultimate",
        descripcion: "Botines ligeros diseñados para cambios rápidos de dirección y movimientos explosivos.",
        precio: 124990,
        stock: 11,
        stockCritico: 2,
        categoria: "Calzado",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1QrgZToAivxgM6X4_EeufKJHSmEnJ3IM1k6_pC9yqmg&s=10"
    },
    {
        codigo: "BOT-006",
        nombre: "Botines Ultra Match",
        descripcion: "Botines veloces y livianos ideales para jugadores ofensivos.",
        precio: 99990,
        stock: 15,
        stockCritico: 3,
        categoria: "Calzado",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj2jKJl4OOeBXjpN4bhkousAqgbfFSneMeEUKx7R8Qqw&s=10"
    },

    // ==========================================
    // BALONES
    // ==========================================

    {
        codigo: "BAL-001",
        nombre: "Balón Oficial Champions League",
        descripcion: "Balón de alta resistencia con tecnología de sellado térmico y certificación FIFA Quality Pro.",
        precio: 34990,
        stock: 40,
        stockCritico: 8,
        categoria: "Balones",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWjVYhzXHV8AUyTkA-POP6kOzEgd8qq-GCYBH2gUzojZ0w1DTS9Bp5W6pf&s=10"
    },
    {
        codigo: "BAL-002",
        nombre: "Balón Mundial 2026",
        descripcion: "Balón inspirado en la competición mundial con cubierta resistente y excelente control.",
        precio: 39990,
        stock: 35,
        stockCritico: 7,
        categoria: "Balones",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlj__hx2PPeI2W7bW9_m7HUnNQg9QYq4nqkKdWecTXxA&s=10"
    },
    {
        codigo: "BAL-003",
        nombre: "Balón Premier League",
        descripcion: "Balón diseñado para ofrecer trayectoria estable y gran respuesta en diferentes superficies.",
        precio: 32990,
        stock: 30,
        stockCritico: 6,
        categoria: "Balones",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVvJjwC8_8BhxOAyQ7xj0NB050TjujczeFbnzzAcE3kA&s=10"
    },
    {
        codigo: "BAL-004",
        nombre: "Balón LaLiga Profesional",
        descripcion: "Balón de fútbol resistente con diseño inspirado en la liga española.",
        precio: 31990,
        stock: 28,
        stockCritico: 5,
        categoria: "Balones",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfj_3LQ6v9mmbo7KKlm3djkQgMQxFUrXaJMopINk5NRg&s=10"
    },
    {
        codigo: "BAL-005",
        nombre: "Balón Serie A",
        descripcion: "Balón de entrenamiento y competición con buena durabilidad y control.",
        precio: 29990,
        stock: 32,
        stockCritico: 6,
        categoria: "Balones",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWPViZ6EifAf2tb8MpQ78hSX1rSN4N5WNVZ_gfpjvvlw&s=10"
    },
    {
        codigo: "BAL-006",
        nombre: "Balón Copa Libertadores",
        descripcion: "Balón inspirado en la Copa Libertadores con construcción resistente para uso frecuente.",
        precio: 34990,
        stock: 25,
        stockCritico: 5,
        categoria: "Balones",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeQ8TsNMPIxSQqwsHHcKlRG8HunMJJ8l2SueCfzwPA9g&s=10"
    },

    // ==========================================
    // MEDIAS
    // ==========================================

    {
        codigo: "MED-001",
        nombre: "Medias Selección Chilena",
        descripcion: "Medias deportivas largas de la Selección Chilena con tejido elástico y transpirable.",
        precio: 12990,
        stock: 35,
        stockCritico: 7,
        categoria: "Medias",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTynQedFVh3VdzJkRpdBy0jfj1B144AsOzzen9q9WVBmA&s=10"
    },
    {
        codigo: "MED-002",
        nombre: "Medias Selección de Alemania",
        descripcion: "Medias deportivas de Alemania diseñadas para ofrecer comodidad durante el juego.",
        precio: 12990,
        stock: 30,
        stockCritico: 6,
        categoria: "Medias",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV66LkdFKQ6pGfPtDHx4qOzjgyItf-mPVvNR97jDQetQ&s=10"
    },
    {
        codigo: "MED-003",
        nombre: "Medias Selección de Francia",
        descripcion: "Medias oficiales inspiradas en la indumentaria de la selección francesa.",
        precio: 12990,
        stock: 30,
        stockCritico: 6,
        categoria: "Medias",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_eNlyvup5Lr2MMH4vG8rwxxeQ0h8a1gf47VEyzexCtQ&s=10"
    },
    {
        codigo: "MED-004",
        nombre: "Medias Selección de Portugal",
        descripcion: "Medias deportivas de Portugal con ajuste firme y tejido respirable.",
        precio: 12990,
        stock: 28,
        stockCritico: 5,
        categoria: "Medias",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvq8H60dKi8C4lP6lUsp8DSMqAZ2CXL4rKIFUQfxC7EQ&s=10"
    },
    {
        codigo: "MED-005",
        nombre: "Medias Colo-Colo",
        descripcion: "Medias deportivas inspiradas en la indumentaria oficial de Colo-Colo.",
        precio: 11990,
        stock: 35,
        stockCritico: 7,
        categoria: "Medias",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI613DkmKAPOI2mrqyEw8ew0Fh4vbKQQws-mHXLCqR4Q&s"
    },
    {
        codigo: "MED-006",
        nombre: "Medias Real Madrid",
        descripcion: "Medias deportivas del Real Madrid diseñadas para brindar comodidad y sujeción.",
        precio: 13990,
        stock: 32,
        stockCritico: 6,
        categoria: "Medias",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJEsd0wUzC117JliSIEjdl2mbwP7KSavzHx5XmJkGEOQ&s=10"
    },

    // ==========================================
    // CANILLERAS
    // ==========================================

    {
        codigo: "CAN-001",
        nombre: "Canilleras Mercurial Lite",
        descripcion: "Canilleras ligeras y resistentes diseñadas para proteger la zona frontal de la pierna.",
        precio: 19990,
        stock: 25,
        stockCritico: 5,
        categoria: "Canilleras",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTomd9bW2Zmo8Cu0QOWMxL8bTyNB3C_Ztz8SltAg8Ah8Q&s=10"
    },
    {
        codigo: "CAN-002",
        nombre: "Canilleras Predator",
        descripcion: "Canilleras deportivas con carcasa resistente y diseño anatómico.",
        precio: 21990,
        stock: 22,
        stockCritico: 4,
        categoria: "Canilleras",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDL25w_1nzgi6QV-emiumL4RS7x58Z8XLl7PLpMq3V1g&s=10"
    },
    {
        codigo: "CAN-003",
        nombre: "Canilleras Ultra Flex",
        descripcion: "Canilleras livianas con diseño flexible para mayor comodidad durante el partido.",
        precio: 18990,
        stock: 28,
        stockCritico: 5,
        categoria: "Canilleras",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpUJb3cDttfeaibW6GV-CV3xYSr9fHXcubuE7_mDwgJQ&s=10"
    },
    {
        codigo: "CAN-004",
        nombre: "Canilleras Pro Shield",
        descripcion: "Protección deportiva reforzada para entrenamientos y partidos de alta intensidad.",
        precio: 23990,
        stock: 20,
        stockCritico: 4,
        categoria: "Canilleras",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROfanzVfKTA0d2abkIzx4Ja5N81cnqYVyf_fORztSQ5g&s=10"
    },
    {
        codigo: "CAN-005",
        nombre: "Canilleras Strike Guard",
        descripcion: "Canilleras compactas con estructura resistente y diseño ergonómico.",
        precio: 17990,
        stock: 30,
        stockCritico: 6,
        categoria: "Canilleras",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROg-_1thxr77UJ66fA0z_w5GLoE9UeOHDIqddOO7UqLQ&s=10"
    },
    {
        codigo: "CAN-006",
        nombre: "Canilleras Elite Protect",
        descripcion: "Canilleras de alto rendimiento con protección reforzada y bajo peso.",
        precio: 24990,
        stock: 18,
        stockCritico: 3,
        categoria: "Canilleras",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7t0VKP6SzVPXw0FwHi639FXDiqNOoaMkwzl0gc92jxQ&s"
    },

    // ==========================================
    // GUANTES DE ARQUERO
    // ==========================================

    {
        codigo: "GUA-001",
        nombre: "Guantes de Arquero Pro Grip",
        descripcion: "Guantes de arquero con látex de alto agarre y varillas de protección en los dedos.",
        precio: 29990,
        stock: 15,
        stockCritico: 3,
        categoria: "Guantes",
        imagen: "https://nikeclprod.vtexassets.com/arquivos/ids/1102460/HQ0258_010_A_PREM.jpg?v=638635075418170000"
    },
    {
        codigo: "GUA-002",
        nombre: "Guantes Predator Pro",
        descripcion: "Guantes de arquero con palma de gran adherencia y ajuste firme para mayor seguridad.",
        precio: 34990,
        stock: 12,
        stockCritico: 3,
        categoria: "Guantes",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB-ErODUE44ciaNWeNfKCbU8fkRNzZ8YjRF9sKzY7kIQ&s=10"
    },
    {
        codigo: "GUA-003",
        nombre: "Guantes Vapor Grip",
        descripcion: "Guantes ligeros con palma acolchada diseñados para mejorar el agarre y la comodidad.",
        precio: 32990,
        stock: 14,
        stockCritico: 3,
        categoria: "Guantes",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRedRXS7mZNwSYPuS52tCgyjPJ3_LcYzYKn-eo98t6Huw&s=10"
    },
    {
        codigo: "GUA-004",
        nombre: "Guantes Future Ultimate",
        descripcion: "Guantes de arquero con corte ergonómico y material flexible para facilitar el movimiento de las manos.",
        precio: 31990,
        stock: 16,
        stockCritico: 3,
        categoria: "Guantes",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVtex4J9GU3Bvz3p0gBMjWwbI6ac-RnjrUZSkVbAkAbg&s=10"
    },
    {
        codigo: "GUA-005",
        nombre: "Guantes Match Control",
        descripcion: "Guantes resistentes para entrenamientos y partidos con buen nivel de amortiguación.",
        precio: 24990,
        stock: 20,
        stockCritico: 4,
        categoria: "Guantes",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYz4_l-glNNeJMXhyA7k4_VrCSPGwCVBzbF_QEW6P3Qg&s=10"
    },
    {
        codigo: "GUA-006",
        nombre: "Guantes Elite Keeper",
        descripcion: "Guantes de alto rendimiento con palma reforzada y excelente adherencia en condiciones secas o húmedas.",
        precio: 39990,
        stock: 10,
        stockCritico: 2,
        categoria: "Guantes",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHO3oRun7Kz7s-eP_PMQQFqjUDWjSzTYCCG1PSZqAMhA&s=10"
    }
];

// Guardar productos en localStorage
localStorage.setItem("productos", JSON.stringify(productosBase));