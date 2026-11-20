
-- Rey del Balón
-- Tabla necesaria para la renovación de JWT
-- Ejecutar después de crear la tabla usuario.

USE rey_del_balon;

CREATE TABLE IF NOT EXISTS refresh_token (
    id_refresh_token BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion DATETIME NOT NULL,
    revocado TINYINT(1) NOT NULL DEFAULT 0,

    PRIMARY KEY (id_refresh_token),

    UNIQUE KEY token_hash (token_hash),

    KEY fk_refresh_token_usuario (id_usuario),

    CONSTRAINT fk_refresh_token_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario)
        ON DELETE CASCADE

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;
