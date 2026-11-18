-- MySQL dump 10.13  Distrib 8.4.13, for Win64 (x86_64)
--
-- Host: localhost    Database: rey_del_balon
-- ------------------------------------------------------
-- Server version	8.4.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `rey_del_balon`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `rey_del_balon` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `rey_del_balon`;

--
-- Table structure for table `boleta`
--

DROP TABLE IF EXISTS `boleta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boleta` (
  `id_boleta` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint unsigned DEFAULT NULL,
  `fecha_emision` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nombre_cliente` varchar(80) NOT NULL,
  `apellidos_cliente` varchar(120) NOT NULL,
  `email_cliente` varchar(150) NOT NULL,
  `tipo_entrega` enum('DOMICILIO','RETIRO') NOT NULL,
  `calle` varchar(150) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `departamento` varchar(50) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `comuna` varchar(100) DEFAULT NULL,
  `indicaciones` varchar(500) DEFAULT NULL,
  `resultado_pago` enum('PENDIENTE','APROBADO','RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
  `estado` enum('REGISTRADA','PREPARANDO','DESPACHADA','ENTREGADA','ANULADA') NOT NULL DEFAULT 'REGISTRADA',
  `total` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id_boleta`),
  KEY `idx_boleta_usuario` (`id_usuario`),
  KEY `idx_boleta_fecha` (`fecha_emision`),
  CONSTRAINT `fk_boleta_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL,
  CONSTRAINT `chk_boleta_total` CHECK ((`total` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boleta`
--

LOCK TABLES `boleta` WRITE;
/*!40000 ALTER TABLE `boleta` DISABLE KEYS */;
/*!40000 ALTER TABLE `boleta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `uk_categoria_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Camisetas',NULL,1,'2026-11-17 15:49:41','2026-11-17 15:49:41'),(2,'Shorts',NULL,1,'2026-11-17 15:49:41','2026-11-17 15:49:41'),(3,'Calzado',NULL,1,'2026-11-17 15:49:41','2026-11-17 15:49:41'),(4,'Balones',NULL,1,'2026-11-17 15:49:41','2026-11-17 15:49:41'),(5,'Medias',NULL,1,'2026-11-17 15:49:41','2026-11-17 15:49:41'),(6,'Canilleras',NULL,1,'2026-11-17 15:49:41','2026-11-17 15:49:41'),(7,'Guantes',NULL,1,'2026-11-17 15:49:41','2026-11-17 15:49:41');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_boleta`
--

DROP TABLE IF EXISTS `detalle_boleta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_boleta` (
  `id_detalle` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_boleta` bigint unsigned NOT NULL,
  `id_producto` bigint unsigned DEFAULT NULL,
  `codigo_producto` varchar(20) NOT NULL,
  `nombre_producto` varchar(150) NOT NULL,
  `talla` varchar(10) DEFAULT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `cantidad` int unsigned NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `idx_detalle_boleta` (`id_boleta`),
  KEY `idx_detalle_producto` (`id_producto`),
  CONSTRAINT `fk_detalle_boleta` FOREIGN KEY (`id_boleta`) REFERENCES `boleta` (`id_boleta`) ON DELETE CASCADE,
  CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE SET NULL,
  CONSTRAINT `chk_detalle_cantidad` CHECK ((`cantidad` > 0)),
  CONSTRAINT `chk_detalle_precio` CHECK ((`precio_unitario` > 0)),
  CONSTRAINT `chk_detalle_subtotal` CHECK ((`subtotal` = (`precio_unitario` * `cantidad`)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_boleta`
--

LOCK TABLES `detalle_boleta` WRITE;
/*!40000 ALTER TABLE `detalle_boleta` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_boleta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id_producto` bigint unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `precio` decimal(12,2) NOT NULL,
  `stock` int unsigned NOT NULL DEFAULT '0',
  `stock_critico` int unsigned NOT NULL DEFAULT '0',
  `imagen_url` varchar(1000) DEFAULT NULL,
  `en_oferta` tinyint(1) NOT NULL DEFAULT '0',
  `precio_anterior` decimal(12,2) DEFAULT NULL,
  `id_categoria` bigint unsigned NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_producto`),
  UNIQUE KEY `uk_producto_codigo` (`codigo`),
  KEY `idx_producto_categoria` (`id_categoria`),
  CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`) ON DELETE RESTRICT,
  CONSTRAINT `chk_producto_oferta` CHECK ((((`en_oferta` = 0) and (`precio_anterior` is null)) or ((`en_oferta` = 1) and (`precio_anterior` is not null) and (`precio_anterior` > `precio`)))),
  CONSTRAINT `chk_producto_precio` CHECK ((`precio` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'CAM-001','Camiseta Selección Chilena 2026','Camiseta oficial de La Roja versión local con tecnología AEROREADY de absorción de humedad.',59990.00,25,5,'https://www.lacabala.cl/cdn/shop/files/99f822ae.jpg?v=1780623347&width=600',0,NULL,1,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(2,'CAM-002','Camiseta Selección de Alemania 2026','Camiseta oficial de la Die Mannschaft versión local, tejido de alto rendimiento con detalles icónicos.',64990.00,20,4,'https://gravitshop.cl/cdn/shop/files/1b07a787_jpg_7f9d6d12-44b4-4888-bd44-7f7a1de04dd9.webp?v=1784734431',0,NULL,1,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(3,'CAM-003','Camiseta Selección de Francia 2026','Indumentaria oficial de Les Bleus versión local, ligera y transpirable para máximo rendimiento.',64990.00,18,3,'https://gravitshop.cl/cdn/shop/files/francia-visitante-26-27-player-1.jpg?v=1785864791',0,NULL,1,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(4,'CAM-004','Camiseta Selección de Portugal 2026','Camiseta oficial de la selección portuguesa con acabado clásico en rojo burdeos y detalles dorados.',64990.00,15,3,'https://gravitshop.cl/cdn/shop/files/6d945c1f_jpg.webp?v=1784734431',0,NULL,1,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(5,'CAM-005','Camiseta Colo-Colo Oficial 2026','Camiseta oficial del Eterno Campeón versión local, diseño clásico en blanco y negro.',54990.00,30,5,'https://www.lacabala.cl/cdn/shop/files/7e7ee4f4.jpg?v=1780623210',0,NULL,1,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(6,'CAM-006','Camiseta Real Madrid Local 2026','Camiseta oficial del cuadro merengue, blanca clásica con detalles en color oro.',69990.00,22,4,'https://static.wixstatic.com/media/d48029_599e48866d2c45bfb25a34fa7c33ff69~mv2.jpg/v1/fill/w_480,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/d48029_599e48866d2c45bfb25a34fa7c33ff69~mv2.jpg',0,NULL,1,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(7,'SHO-001','Short Selección Chilena 2026','Short oficial de la Selección Chilena diseñado para complementar la camiseta local.',29990.00,20,4,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlSpl0FdInxZEZiqXAxNcr4EHpXnp9TybAOo_APNmo5A&s=10',0,NULL,2,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(8,'SHO-002','Short Selección de Alemania 2026','Short oficial de Alemania confeccionado con tejido deportivo ligero y transpirable.',32990.00,18,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS16jMZeVo8R3YnZoKRDq9E9oA1XlvfzcpmXCCZFw_Ntw&s=10',0,NULL,2,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(9,'SHO-003','Short Selección de Francia 2026','Short oficial de Francia con ajuste cómodo para entrenamiento y uso deportivo.',32990.00,18,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT4w408Z9OKulMNFyBMarjq-fm9d0R4smO9Hz8sAe0Zw&s=10',0,NULL,2,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(10,'SHO-004','Short Selección de Portugal 2026','Short oficial de Portugal con diseño deportivo y tecnología de secado rápido.',32990.00,16,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZoru2S0EuDd2UFrr-60IsBnbM_fO3XUZ57dyQMeP3kw&s=10',0,NULL,2,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(11,'SHO-005','Short Colo-Colo Oficial 2026','Short oficial de Colo-Colo ideal para complementar la indumentaria del club.',28990.00,22,4,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMNjC0IhU2lD8Xh34LqCSlZw_zmGVstUQwioo7sf1GOA&s=10',0,NULL,2,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(12,'SHO-006','Short Real Madrid Local 2026','Short oficial del Real Madrid confeccionado para entregar comodidad y libertad de movimiento.',34990.00,20,4,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTTOvdEuGFCR0pm85oo7TDMmPXd8HcDVUXXMSFE86Dzw&s=10',0,NULL,2,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(13,'BOT-001','Botines Mercurial Superfly','Zapatillas de fútbol para césped natural con ajuste anatómico y agarre profesional.',129990.00,10,2,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfXVa5khfe1sX16w0Lak6xTSRrPD4cPTrhGWxt4s0HNp2ZcmkrIadaHin6&s=10',0,NULL,3,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(14,'BOT-002','Botines Phantom GX','Botines diseñados para mejorar el control del balón y la precisión durante el juego.',119990.00,12,2,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLUHFiZWTpbtO4e01BUl27uJxXyoBdM9tGbcFEdXdL1Q&s=10',0,NULL,3,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(15,'BOT-003','Botines Predator Elite','Botines de fútbol con superficie de control optimizada para pases y remates precisos.',139990.00,9,2,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2vrimoe3AZyQj8RuwNmrVdCg2QwKt-0gdY9fFiGKGfw&s=10',0,NULL,3,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(16,'BOT-004','Botines Copa Pure','Botines con diseño clásico y ajuste cómodo para jugadores que buscan mayor sensibilidad con el balón.',109990.00,14,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThVyvkZOBL6Qni3f6uQ6Cfw775SGtKdbTbCFIHJl-gOA&s=10',0,NULL,3,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(17,'BOT-005','Botines Future Ultimate','Botines ligeros diseñados para cambios rápidos de dirección y movimientos explosivos.',124990.00,11,2,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1QrgZToAivxgM6X4_EeufKJHSmEnJ3IM1k6_pC9yqmg&s=10',0,NULL,3,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(18,'BOT-006','Botines Ultra Match','Botines veloces y livianos ideales para jugadores ofensivos.',99990.00,15,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj2jKJl4OOeBXjpN4bhkousAqgbfFSneMeEUKx7R8Qqw&s=10',0,NULL,3,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(19,'BAL-001','Balón Oficial Champions League','Balón de alta resistencia con tecnología de sellado térmico y certificación FIFA Quality Pro.',34990.00,40,8,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWjVYhzXHV8AUyTkA-POP6kOzEgd8qq-GCYBH2gUzojZ0w1DTS9Bp5W6pf&s=10',0,NULL,4,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(20,'BAL-002','Balón Mundial 2026','Balón inspirado en la competición mundial con cubierta resistente y excelente control.',39990.00,35,7,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlj__hx2PPeI2W7bW9_m7HUnNQg9QYq4nqkKdWecTXxA&s=10',0,NULL,4,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(21,'BAL-003','Balón Premier League','Balón diseñado para ofrecer trayectoria estable y gran respuesta en diferentes superficies.',32990.00,30,6,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVvJjwC8_8BhxOAyQ7xj0NB050TjujczeFbnzzAcE3kA&s=10',0,NULL,4,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(22,'BAL-004','Balón LaLiga Profesional','Balón de fútbol resistente con diseño inspirado en la liga española.',31990.00,28,5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfj_3LQ6v9mmbo7KKlm3djkQgMQxFUrXaJMopINk5NRg&s=10',0,NULL,4,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(23,'BAL-005','Balón Serie A','Balón de entrenamiento y competición con buena durabilidad y control.',29990.00,32,6,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWPViZ6EifAf2tb8MpQ78hSX1rSN4N5WNVZ_gfpjvvlw&s=10',0,NULL,4,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(24,'BAL-006','Balón Copa Libertadores','Balón inspirado en la Copa Libertadores con construcción resistente para uso frecuente.',34990.00,25,5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeQ8TsNMPIxSQqwsHHcKlRG8HunMJJ8l2SueCfzwPA9g&s=10',0,NULL,4,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(25,'MED-001','Medias Selección Chilena','Medias deportivas largas de la Selección Chilena con tejido elástico y transpirable.',12990.00,35,7,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTynQedFVh3VdzJkRpdBy0jfj1B144AsOzzen9q9WVBmA&s=10',0,NULL,5,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(26,'MED-002','Medias Selección de Alemania','Medias deportivas de Alemania diseñadas para ofrecer comodidad durante el juego.',12990.00,30,6,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV66LkdFKQ6pGfPtDHx4qOzjgyItf-mPVvNR97jDQetQ&s=10',0,NULL,5,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(27,'MED-003','Medias Selección de Francia','Medias oficiales inspiradas en la indumentaria de la selección francesa.',12990.00,30,6,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_eNlyvup5Lr2MMH4vG8rwxxeQ0h8a1gf47VEyzexCtQ&s=10',0,NULL,5,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(28,'MED-004','Medias Selección de Portugal','Medias deportivas de Portugal con ajuste firme y tejido respirable.',12990.00,28,5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvq8H60dKi8C4lP6lUsp8DSMqAZ2CXL4rKIFUQfxC7EQ&s=10',0,NULL,5,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(29,'MED-005','Medias Colo-Colo','Medias deportivas inspiradas en la indumentaria oficial de Colo-Colo.',11990.00,35,7,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI613DkmKAPOI2mrqyEw8ew0Fh4vbKQQws-mHXLCqR4Q&s',0,NULL,5,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(30,'MED-006','Medias Real Madrid','Medias deportivas del Real Madrid diseñadas para brindar comodidad y sujeción.',13990.00,32,6,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJEsd0wUzC117JliSIEjdl2mbwP7KSavzHx5XmJkGEOQ&s=10',0,NULL,5,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(31,'CAN-001','Canilleras Mercurial Lite','Canilleras ligeras y resistentes diseñadas para proteger la zona frontal de la pierna.',19990.00,25,5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTomd9bW2Zmo8Cu0QOWMxL8bTyNB3C_Ztz8SltAg8Ah8Q&s=10',0,NULL,6,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(32,'CAN-002','Canilleras Predator','Canilleras deportivas con carcasa resistente y diseño anatómico.',21990.00,22,4,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDL25w_1nzgi6QV-emiumL4RS7x58Z8XLl7PLpMq3V1g&s=10',0,NULL,6,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(33,'CAN-003','Canilleras Ultra Flex','Canilleras livianas con diseño flexible para mayor comodidad durante el partido.',18990.00,28,5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpUJb3cDttfeaibW6GV-CV3xYSr9fHXcubuE7_mDwgJQ&s=10',0,NULL,6,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(34,'CAN-004','Canilleras Pro Shield','Protección deportiva reforzada para entrenamientos y partidos de alta intensidad.',23990.00,20,4,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROfanzVfKTA0d2abkIzx4Ja5N81cnqYVyf_fORztSQ5g&s=10',0,NULL,6,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(35,'CAN-005','Canilleras Strike Guard','Canilleras compactas con estructura resistente y diseño ergonómico.',17990.00,30,6,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROg-_1thxr77UJ66fA0z_w5GLoE9UeOHDIqddOO7UqLQ&s=10',0,NULL,6,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(36,'CAN-006','Canilleras Elite Protect','Canilleras de alto rendimiento con protección reforzada y bajo peso.',24990.00,18,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7t0VKP6SzVPXw0FwHi639FXDiqNOoaMkwzl0gc92jxQ&s',0,NULL,6,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(37,'GUA-001','Guantes de Arquero Pro Grip','Guantes de arquero con látex de alto agarre y varillas de protección en los dedos.',29990.00,15,3,'https://nikeclprod.vtexassets.com/arquivos/ids/1102460/HQ0258_010_A_PREM.jpg?v=638635075418170000',0,NULL,7,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(38,'GUA-002','Guantes Predator Pro','Guantes de arquero con palma de gran adherencia y ajuste firme para mayor seguridad.',34990.00,12,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB-ErODUE44ciaNWeNfKCbU8fkRNzZ8YjRF9sKzY7kIQ&s=10',0,NULL,7,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(39,'GUA-003','Guantes Vapor Grip','Guantes ligeros con palma acolchada diseñados para mejorar el agarre y la comodidad.',32990.00,14,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRedRXS7mZNwSYPuS52tCgyjPJ3_LcYzYKn-eo98t6Huw&s=10',0,NULL,7,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(40,'GUA-004','Guantes Future Ultimate','Guantes de arquero con corte ergonómico y material flexible para facilitar el movimiento de las manos.',31990.00,16,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVtex4J9GU3Bvz3p0gBMjWwbI6ac-RnjrUZSkVbAkAbg&s=10',0,NULL,7,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(41,'GUA-005','Guantes Match Control','Guantes resistentes para entrenamientos y partidos con buen nivel de amortiguación.',24990.00,20,4,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYz4_l-glNNeJMXhyA7k4_VrCSPGwCVBzbF_QEW6P3Qg&s=10',0,NULL,7,1,'2026-11-17 15:55:20','2026-11-17 15:55:20'),(42,'GUA-006','Guantes Elite Keeper','Guantes de alto rendimiento con palma reforzada y excelente adherencia en condiciones secas o húmedas.',39990.00,10,2,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHO3oRun7Kz7s-eP_PMQQFqjUDWjSzTYCCG1PSZqAMhA&s=10',0,NULL,7,1,'2026-11-17 15:55:20','2026-11-17 15:55:20');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_talla`
--

DROP TABLE IF EXISTS `producto_talla`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_talla` (
  `id_producto_talla` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_producto` bigint unsigned NOT NULL,
  `talla` varchar(10) NOT NULL,
  `stock` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_producto_talla`),
  UNIQUE KEY `uk_producto_talla` (`id_producto`,`talla`),
  CONSTRAINT `fk_talla_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_talla`
--

LOCK TABLES `producto_talla` WRITE;
/*!40000 ALTER TABLE `producto_talla` DISABLE KEYS */;
INSERT INTO `producto_talla` VALUES (1,1,'S',5),(2,1,'M',8),(3,1,'L',7),(4,1,'XL',5),(5,2,'S',4),(6,2,'M',6),(7,2,'L',6),(8,2,'XL',4),(9,3,'S',3),(10,3,'M',5),(11,3,'L',6),(12,3,'XL',4),(13,4,'S',3),(14,4,'M',4),(15,4,'L',5),(16,4,'XL',3),(17,5,'S',6),(18,5,'M',10),(19,5,'L',9),(20,5,'XL',5),(21,7,'S',4),(22,7,'M',6),(23,7,'L',6),(24,7,'XL',4),(25,8,'S',3),(26,8,'M',5),(27,8,'L',6),(28,8,'XL',4),(29,9,'S',3),(30,9,'M',5),(31,9,'L',6),(32,9,'XL',4),(33,10,'S',3),(34,10,'M',5),(35,10,'L',5),(36,10,'XL',3),(37,11,'S',4),(38,11,'M',7),(39,11,'L',7),(40,11,'XL',4),(41,13,'38',1),(42,13,'39',1),(43,13,'40',2),(44,13,'41',2),(45,13,'42',2),(46,13,'43',2),(47,13,'44',0),(48,13,'45',0),(49,14,'38',1),(50,14,'39',1),(51,14,'40',2),(52,14,'41',2),(53,14,'42',2),(54,14,'43',2),(55,14,'44',1),(56,14,'45',1),(57,15,'38',0),(58,15,'39',1),(59,15,'40',1),(60,15,'41',2),(61,15,'42',2),(62,15,'43',2),(63,15,'44',1),(64,15,'45',0),(65,16,'38',1),(66,16,'39',2),(67,16,'40',2),(68,16,'41',3),(69,16,'42',2),(70,16,'43',2),(71,16,'44',1),(72,16,'45',1),(73,17,'38',0),(74,17,'39',1),(75,17,'40',2),(76,17,'41',2),(77,17,'42',2),(78,17,'43',2),(79,17,'44',1),(80,17,'45',1),(81,25,'S',6),(82,25,'M',10),(83,25,'L',11),(84,25,'XL',8),(85,26,'S',5),(86,26,'M',8),(87,26,'L',10),(88,26,'XL',7),(89,27,'S',6),(90,27,'M',8),(91,27,'L',9),(92,27,'XL',7),(93,28,'S',5),(94,28,'M',8),(95,28,'L',9),(96,28,'XL',6),(97,29,'S',6),(98,29,'M',10),(99,29,'L',11),(100,29,'XL',8),(101,31,'S',7),(102,31,'M',10),(103,31,'L',8),(104,32,'S',6),(105,32,'M',9),(106,32,'L',7),(107,33,'S',8),(108,33,'M',11),(109,33,'L',9),(110,34,'S',5),(111,34,'M',9),(112,34,'L',6),(113,35,'S',9),(114,35,'M',12),(115,35,'L',9),(116,37,'7',3),(117,37,'8',4),(118,37,'9',5),(119,37,'10',3),(120,38,'7',2),(121,38,'8',4),(122,38,'9',4),(123,38,'10',2),(124,39,'7',3),(125,39,'8',4),(126,39,'9',5),(127,39,'10',2),(128,40,'7',3),(129,40,'8',5),(130,40,'9',5),(131,40,'10',3),(132,41,'7',4),(133,41,'8',6),(134,41,'9',6),(135,41,'10',4);
/*!40000 ALTER TABLE `producto_talla` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` bigint unsigned NOT NULL AUTO_INCREMENT,
  `run` varchar(12) DEFAULT NULL,
  `nombre` varchar(80) NOT NULL,
  `apellidos` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `comuna` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('ADMINISTRADOR','VENDEDOR','CLIENTE') NOT NULL DEFAULT 'CLIENTE',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uk_usuario_email` (`email`),
  UNIQUE KEY `uk_usuario_run` (`run`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-18 18:54:36
