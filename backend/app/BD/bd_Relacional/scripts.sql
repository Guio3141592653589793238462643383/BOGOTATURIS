CREATE DATABASE BogotaTuris;
USE BogotaTuris;



CREATE TABLE rol (
    id_rol BIGINT AUTO_INCREMENT NOT NULL,
    rol VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_rol)
);

CREATE TABLE correo (
    id_correo BIGINT AUTO_INCREMENT NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (id_correo)
);

CREATE TABLE nacionalidad (
    id_nac BIGINT AUTO_INCREMENT NOT NULL,
    nacionalidad VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id_nac)
);

CREATE TABLE intereses (
    id_inte BIGINT AUTO_INCREMENT NOT NULL,
    interes VARCHAR(80) NOT NULL UNIQUE,
    PRIMARY KEY (id_inte)
);

CREATE TABLE inte_categoria (
    id_inte_cate BIGINT AUTO_INCREMENT NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    id_inte BIGINT NOT NULL,
    PRIMARY KEY (id_inte_cate),
    FOREIGN KEY (id_inte) REFERENCES intereses (id_inte)
);

CREATE TABLE usuario (
    id_usuario BIGINT AUTO_INCREMENT NOT NULL,
    primer_nombre VARCHAR(50) NOT NULL,
    segundo_nombre VARCHAR(50),
    primer_apellido VARCHAR(50) NOT NULL,
    segundo_apellido VARCHAR(50),
    clave VARCHAR(250) NOT NULL, 
    id_rol BIGINT NOT NULL,
    id_correo BIGINT NOT NULL,
    id_nac BIGINT NOT NULL,
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (id_rol) REFERENCES rol (id_rol),
    FOREIGN KEY (id_correo) REFERENCES correo (id_correo),
    FOREIGN KEY (id_nac) REFERENCES nacionalidad (id_nac)
);

CREATE TABLE intereses_usuario (
    id_inte_usu BIGINT AUTO_INCREMENT NOT NULL,
    id_usuario BIGINT NOT NULL,
    id_inte BIGINT NOT NULL,
    PRIMARY KEY (id_inte_usu),
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
    FOREIGN KEY (id_inte) REFERENCES intereses (id_inte)
);

CREATE TABLE reporte_incidente (
    id_report BIGINT AUTO_INCREMENT NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    fecha_report DATETIME NOT NULL,
    estado VARCHAR(80) NOT NULL,
    id_usuario BIGINT NOT NULL,
    PRIMARY KEY (id_report),
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE comentarios (
    id_com BIGINT NOT NULL,
    tipo_com VARCHAR(50) NOT NULL,
    fecha_com DATE NOT NULL,
    id_usuario BIGINT NOT NULL,
    PRIMARY KEY (id_com),
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE lugar (
    id_lugar BIGINT NOT NULL,
    nombre_lugar VARCHAR(60) NOT NULL,
    tipo_lugar VARCHAR(60) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    hora_aper TIME NOT NULL,
    hora_cierra TIME NOT NULL,
    precios INT NOT NULL,
    id_usuario BIGINT NOT NULL,
    PRIMARY KEY (id_lugar),
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE alerta (
    id_alerta BIGINT NOT NULL,
    tipo_aler VARCHAR(255) NOT NULL,
    fecha_alerta DATE NOT NULL,
    id_lugar BIGINT NOT NULL,
    PRIMARY KEY (id_alerta),
    FOREIGN KEY (id_lugar) REFERENCES lugar (id_lugar)
);

CREATE TABLE rutas (
    id_ruta BIGINT AUTO_INCREMENT NOT NULL,
    inicio_ruta VARCHAR(50) NOT NULL,
    fin_ruta VARCHAR(50) NOT NULL,
    id_lugar BIGINT NOT NULL,
    PRIMARY KEY (id_ruta),
    FOREIGN KEY (id_lugar) REFERENCES lugar (id_lugar)
);