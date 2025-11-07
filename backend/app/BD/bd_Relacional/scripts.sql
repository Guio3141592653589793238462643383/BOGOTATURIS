CREATE DATABASE IF NOT EXISTS BogotaTuris; 

USE BogotaTuris;

CREATE TABLE nacionalidad (
    id_nac BIGINT NOT NULL AUTO_INCREMENT,
    nacionalidad VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_nac),
    UNIQUE KEY uk_nacionalidad (nacionalidad)
);

CREATE TABLE correo (
    id_correo BIGINT NOT NULL AUTO_INCREMENT,
    correo VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_correo),
    UNIQUE KEY uk_correo (correo)
);

CREATE TABLE intereses (
    id_inte BIGINT NOT NULL AUTO_INCREMENT,
    interes VARCHAR(80) NOT NULL,
    PRIMARY KEY (id_inte),
    UNIQUE KEY uk_interes (interes)
);

CREATE TABLE tipo_lugar (
    id_tipo BIGINT NOT NULL AUTO_INCREMENT,
    nombre_tipo VARCHAR(60) NOT NULL,
    PRIMARY KEY (id_tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuario (
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    primer_nombre VARCHAR(50) NOT NULL,
    segundo_nombre VARCHAR(50) DEFAULT NULL,
    primer_apellido VARCHAR(50) NOT NULL,
    segundo_apellido VARCHAR(50) DEFAULT NULL,
    clave VARCHAR(250) NOT NULL,
    id_rol BIGINT NOT NULL,
    id_correo BIGINT NOT NULL,
    id_nac BIGINT NOT NULL,
    acepto_terminos TINYINT(1) NOT NULL DEFAULT 0,
    acepto_tratamiento_datos TINYINT(1) NOT NULL DEFAULT 0,
    fecha_aceptacion_terminos DATETIME DEFAULT NULL,
    fecha_aceptacion_tratamiento DATETIME DEFAULT NULL,
    email_verificado TINYINT(1) NOT NULL DEFAULT 0,
    fecha_verificacion_email DATETIME DEFAULT NULL,
    PRIMARY KEY (id_usuario),
    KEY id_rol (id_rol),
    KEY id_correo (id_correo),
    KEY id_nac (id_nac),
    CONSTRAINT usuario_ibfk_1 FOREIGN KEY (id_rol) REFERENCES rol (id_rol),
    CONSTRAINT usuario_ibfk_2 FOREIGN KEY (id_correo) REFERENCES correo (id_correo),
    CONSTRAINT usuario_ibfk_3 FOREIGN KEY (id_nac) REFERENCES nacionalidad (id_nac)
);

CREATE TABLE token_verificacion (
    id_token BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion DATETIME NOT NULL,
    usado TINYINT(1) NOT NULL DEFAULT 0,
    fecha_uso DATETIME DEFAULT NULL,
    PRIMARY KEY (id_token),
    UNIQUE KEY token (token),
    KEY idx_token (token),
    KEY idx_usuario_token (id_usuario),
    CONSTRAINT token_verificacion_ibfk_1 FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE CASCADE
);

CREATE TABLE historial_aceptaciones (
    id_historial BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    acepto TINYINT(1) NOT NULL,
    fecha_accion DATETIME NOT NULL,
    PRIMARY KEY (id_historial),
    KEY idx_usuario_tipo (id_usuario, tipo_documento),
    KEY idx_fecha (fecha_accion),
    CONSTRAINT historial_aceptaciones_ibfk_1 FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE CASCADE
);

CREATE TABLE visualizacion_pdf (
    id_visualizacion BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT DEFAULT NULL,
    session_id VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    fecha_visualizacion DATETIME NOT NULL,
    tiempo_visualizacion INT DEFAULT NULL,
    PRIMARY KEY (id_visualizacion),
    KEY id_usuario (id_usuario),
    KEY idx_session (session_id),
    KEY idx_tipo (tipo_documento),
    KEY idx_fecha (fecha_visualizacion),
    CONSTRAINT visualizacion_pdf_ibfk_1 FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE SET NULL
);

CREATE TABLE intereses_usuario (
    id_inte_usu BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    id_inte BIGINT NOT NULL,
    PRIMARY KEY (id_inte_usu),
    KEY id_usuario (id_usuario),
    KEY id_inte (id_inte),
    CONSTRAINT intereses_usuario_ibfk_1 FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT intereses_usuario_ibfk_2 FOREIGN KEY (id_inte) 
        REFERENCES intereses (id_inte) ON DELETE CASCADE
);

CREATE TABLE comentarios (
    id_com BIGINT NOT NULL AUTO_INCREMENT,
    tipo_com VARCHAR(50) NOT NULL,
    calificacion INT NOT NULL,
    fecha_com DATE NOT NULL,
    id_usuario BIGINT NOT NULL,
    PRIMARY KEY (id_com),
    KEY id_usuario (id_usuario),
    CONSTRAINT comentarios_ibfk_1 FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE CASCADE
);

CREATE TABLE lugar (
    id_lugar BIGINT NOT NULL AUTO_INCREMENT,
    id_tipo BIGINT NOT NULL,
    nombre_lugar VARCHAR(60) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    hora_aper TIME NOT NULL,
    hora_cierra TIME NOT NULL,
    precios INT NOT NULL,
    imagen_url VARCHAR(255) NOT NULL,
    id_usuario BIGINT NOT NULL,
    PRIMARY KEY (id_lugar),
    KEY id_usuario (id_usuario),
    KEY id_tipo (id_tipo),
    CONSTRAINT lugar_ibfk_1 FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT id_tipo FOREIGN KEY (id_tipo) 
        REFERENCES tipo_lugar (id_tipo)
);

CREATE TABLE alerta (
    id_alerta BIGINT NOT NULL AUTO_INCREMENT,
    tipo_aler VARCHAR(255) NOT NULL,
    fecha_alerta DATE NOT NULL,
    id_lugar BIGINT NOT NULL,
    id_usuario BIGINT NOT NULL,
    PRIMARY KEY (id_alerta),
    KEY id_lugar (id_lugar),
    KEY id_usuario (id_usuario),
    CONSTRAINT alerta_ibfk_1 FOREIGN KEY (id_lugar) 
        REFERENCES lugar (id_lugar) ON DELETE CASCADE,
    CONSTRAINT id_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE CASCADE
);

CREATE TABLE categoria (
    id_categoria BIGINT NOT NULL AUTO_INCREMENT,
    categoria VARCHAR(80) NOT NULL,
    id_inte BIGINT NOT NULL,
    PRIMARY KEY (id_categoria),
    KEY id_inte (id_inte),
    CONSTRAINT id_inte FOREIGN KEY (id_inte) 
        REFERENCES intereses (id_inte) ON DELETE CASCADE
);

CREATE TABLE inte_categoria (
    id_inte_cate BIGINT NOT NULL AUTO_INCREMENT,
    categoria VARCHAR(80) NOT NULL,
    id_inte BIGINT NOT NULL,
    PRIMARY KEY (id_inte_cate),
    KEY id_inte (id_inte),
    CONSTRAINT inte_categoria_ibfk_1 FOREIGN KEY (id_inte) 
        REFERENCES intereses (id_inte) ON DELETE CASCADE
);