CREATE DATABASE IF NOT EXISTS BogotaTuris CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE BogotaTuris;

CREATE TABLE IF NOT EXISTS rol (
    id_rol BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS correo (
    id_correo BIGINT PRIMARY KEY AUTO_INCREMENT,
    correo VARCHAR(255) NOT NULL UNIQUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS nacionalidad (
    id_nac BIGINT PRIMARY KEY AUTO_INCREMENT,
    nacionalidad VARCHAR(50) NOT NULL UNIQUE,
    codigo_pais VARCHAR(3),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS intereses (
    id_inte BIGINT PRIMARY KEY AUTO_INCREMENT,
    interes VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    icono VARCHAR(50),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inte_categoria (
    id_inte_cate BIGINT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(80) NOT NULL,
    id_inte BIGINT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_inte) REFERENCES intereses(id_inte) ON DELETE CASCADE,
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario BIGINT PRIMARY KEY AUTO_INCREMENT,
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

CREATE TABLE IF NOT EXISTS historial_aceptaciones (
    id_historial BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    acepto BOOLEAN NOT NULL,
    fecha_accion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario_tipo (id_usuario, tipo_documento),
    INDEX idx_fecha_accion (fecha_accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS visualizacion_pdf (
    id_visualizacion BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_usuario BIGINT,
    session_id VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    fecha_visualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tiempo_visualizacion INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    INDEX idx_session (session_id),
    INDEX idx_tipo_documento (tipo_documento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS token_verificacion (
    id_token BIGINT PRIMARY KEY AUTO_INCREMENT,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS intereses_usuario (
    id_inte_usu BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    id_inte BIGINT NOT NULL,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_inte) REFERENCES intereses(id_inte) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_interes (id_usuario, id_inte),
    INDEX idx_usuario (id_usuario),
    INDEX idx_interes (id_inte)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lugar (
    id_lugar BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre_lugar VARCHAR(60) NOT NULL,
    tipo_lugar VARCHAR(60) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    hora_aper TIME,
    hora_cierra TIME,
    precios INT DEFAULT 0,
    id_usuario BIGINT NOT NULL,
    descripcion TEXT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    INDEX idx_tipo_lugar (tipo_lugar),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS comentarios (
    id_com BIGINT PRIMARY KEY AUTO_INCREMENT,
    tipo_com VARCHAR(50) NOT NULL,
    contenido TEXT,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    fecha_com DATE NOT NULL,
    id_usuario BIGINT NOT NULL,
    id_lugar BIGINT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_lugar) REFERENCES lugar(id_lugar) ON DELETE CASCADE,
    INDEX idx_fecha (fecha_com),
    INDEX idx_calificacion (calificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS alerta (
    id_alerta BIGINT PRIMARY KEY AUTO_INCREMENT,
    tipo_aler VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_alerta DATE NOT NULL,
    id_lugar BIGINT NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_lugar) REFERENCES lugar(id_lugar) ON DELETE CASCADE,
    INDEX idx_activa (activa),
    INDEX idx_fecha (fecha_alerta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rutas (
    id_ruta BIGINT PRIMARY KEY AUTO_INCREMENT,
    inicio_ruta VARCHAR(50) NOT NULL,
    fin_ruta VARCHAR(50) NOT NULL,
    id_lugar BIGINT NOT NULL,
    distancia_km DECIMAL(10, 2),
    tiempo_estimado INT,
    descripcion TEXT,
    FOREIGN KEY (id_lugar) REFERENCES lugar(id_lugar) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reporte_incidente (
    id_report BIGINT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(255) NOT NULL,
    fecha_report DATETIME NOT NULL,
    estado VARCHAR(80) NOT NULL DEFAULT 'Pendiente',
    id_usuario BIGINT NOT NULL,
    id_lugar BIGINT,
    prioridad VARCHAR(20) DEFAULT 'Media',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_lugar) REFERENCES lugar(id_lugar) ON DELETE SET NULL,
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_report)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;