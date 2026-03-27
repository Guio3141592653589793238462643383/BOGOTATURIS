CREATE DATABASE IF NOT EXISTS BogotaTuris;
USE BogotaTuris;

-- 1️⃣ Tablas base
CREATE TABLE rol (
    id_rol BIGINT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(20) NOT NULL
);

CREATE TABLE nacionalidad (
    id_nac BIGINT AUTO_INCREMENT PRIMARY KEY,
    nacionalidad VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE correo (
    id_correo BIGINT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(255) NOT NULL UNIQUE
);

-- 2️⃣ Tabla usuario
CREATE TABLE usuario (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    primer_nombre VARCHAR(50) NOT NULL,
    segundo_nombre VARCHAR(250),
    primer_apellido VARCHAR(250) NOT NULL,
    segundo_apellido VARCHAR(250),
    clave VARCHAR(250) NOT NULL,
    id_rol BIGINT NOT NULL,
    id_correo BIGINT NOT NULL,
    id_nac BIGINT NOT NULL,
    acepto_terminos BOOLEAN NOT NULL DEFAULT FALSE,
    acepto_tratamiento_datos BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_aceptacion_terminos DATETIME,
    fecha_aceptacion_tratamiento DATETIME,
    email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_verificacion_email DATETIME,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
    FOREIGN KEY (id_correo) REFERENCES correo(id_correo),
    FOREIGN KEY (id_nac) REFERENCES nacionalidad(id_nac),
    INDEX idx_email_verificado (email_verificado),
    INDEX idx_fecha_registro (fecha_registro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3️⃣ Historial, tokens y visualizaciones
CREATE TABLE historial_aceptaciones (
    id_historial BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    acepto BOOLEAN NOT NULL,
    fecha_accion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario_tipo (id_usuario, tipo_documento),
    INDEX idx_fecha_accion (fecha_accion)
);

CREATE TABLE visualizacion_pdf (
    id_visualizacion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT,
    session_id VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    fecha_visualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tiempo_visualizacion INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    INDEX idx_session (session_id),
    INDEX idx_tipo_documento (tipo_documento)
);

CREATE TABLE token_verificacion (
    id_token BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion DATETIME NOT NULL,
    usado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_uso DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_usuario_token (id_usuario),
    INDEX idx_expiracion (fecha_expiracion)
);

-- 4️⃣ Intereses y categorías
CREATE TABLE intereses (
    id_inte BIGINT AUTO_INCREMENT PRIMARY KEY,
    interes VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE categoria (
    id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(80) NOT NULL
);

CREATE TABLE inte_categoria (
    id_inte_cate BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_categoria BIGINT NOT NULL,
    id_inte BIGINT NOT NULL,
    FOREIGN KEY (id_inte) REFERENCES intereses(id_inte) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE CASCADE
);

CREATE TABLE intereses_usuario (
    id_inte_usu BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    id_inte BIGINT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_inte) REFERENCES intereses(id_inte) ON DELETE CASCADE
);

-- 5️⃣ Tipos de lugar y lugares
CREATE TABLE tipo_lugar (
    id_tipo BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(60) NOT NULL UNIQUE,
    id_categoria BIGINT,
    CONSTRAINT fk_tipo_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE lugar (
    id_lugar BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_lugar VARCHAR(60) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    hora_aper TIME NOT NULL,
    hora_cierra TIME NOT NULL,
    precios INT NOT NULL,
    imagen_url VARCHAR(500),
    id_tipo BIGINT,
    CONSTRAINT fk_lugar_tipo
        FOREIGN KEY (id_tipo)
        REFERENCES tipo_lugar(id_tipo)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- 6️⃣ Reportes, comentarios y alertas
CREATE TABLE reporte_incidente (
    id_report BIGINT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    fecha_report DATETIME NOT NULL,
    estado VARCHAR(80) NOT NULL DEFAULT 'Pendiente',
    prioridad VARCHAR(20) DEFAULT 'Media',
    id_usuario BIGINT NOT NULL,
    id_lugar BIGINT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_lugar) REFERENCES lugar(id_lugar) ON DELETE SET NULL,
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_report)
);

CREATE TABLE comentarios (
    id_com BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo_com VARCHAR(50) NOT NULL,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    fecha_com DATE NOT NULL,
    id_usuario BIGINT NOT NULL,
    id_lugar BIGINT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_lugar) REFERENCES lugar(id_lugar) ON DELETE CASCADE
);

CREATE TABLE alerta (
    id_alerta BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo_aler VARCHAR(255) NOT NULL,
    fecha_alerta DATE NOT NULL,
    id_usuario BIGINT NOT NULL,
    id_lugar BIGINT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_lugar) REFERENCES lugar(id_lugar) ON DELETE CASCADE
);

-- 7️⃣ Inserción de categorías e intereses por defecto
INSERT INTO categoria (id_categoria, nombre_categoria) VALUES
(1, 'Cultura y arte'),
(2, 'Música y entretenimiento'),
(3, 'Naturaleza y ecoturismo'),
(4, 'Deportes y aventura'),
(5, 'Comida y bebida'),
(6, 'Vida nocturna y social'),
(7, 'Bienestar y aprendizaje');

INSERT INTO inte_categoria (id_inte_cate, id_categoria, id_inte) VALUES
(1, 1, 2),
(2, 1, 7),
(3, 1, 11),
(4, 1, 12),
(5, 1, 14),
(6, 2, 5),
(7, 2, 15),
(8, 2, 8),
(9, 2, 19),
(10, 3, 4),
(11, 3, 18),
(12, 3, 1),
(13, 4, 6),
(14, 5, 3),
(15, 4, 13),
(16, 5, 17),
(17, 6, 10),
(18, 6, 20),
(19, 7, 9),
(20, 7, 16);
