# Guía de Estándares de Código

## Objetivo del Proyecto
El objetivo de este proyecto es desarrollar un software que beneficie tanto a usuarios locales como a turistas extranjeros interesados en explorar Bogotá. La plataforma web proporcionará información esencial sobre lugares turísticos, advertencias sobre zonas peligrosas, recomendaciones de sitios atractivos y alertas sobre riesgos de estafas, especialmente en gastronomía y transporte público.

## Elección del Stack
Hemos optado por utilizar **Python**, **PHP** y **MySQL** en el desarrollo del proyecto por varias razones:

- **Python**: Lenguaje versátil que facilita el desarrollo rápido y tiene una gran cantidad de bibliotecas.
- **PHP**: Ideal para el desarrollo web, con un fuerte soporte en servidores.
- **MySQL**: Base de datos confiable y ampliamente utilizada para gestionar datos.
## 📝 A. Reglas de Nombres

### Variables
- Usa **snake_case** para los nombres de las variables. 
  - Ejemplo: `nombre_usuario`, `precio_total`, `lista_lugares`.

### Clases
- Usa **PascalCase** para los nombres de las clases. 
  - Ejemplo: `Usuario`, `LugarTuristico`, `RecomendacionComida`.
### Métodos
- Usa **PascalCase** para los nombres de los métodos. 
  - Ejemplo: `CalcularPrecio`, `ObtenerRecomendaciones`, `VerificarZonaPeligrosa`.

### Constantes
- Usa **snake_case** para las constantes. 
  - Ejemplo: `maximo_usuarios`, `tiempo_expiracion_token`.

## C. Indentación y Estilo de Código

El estilo de código es crucial para mantener la legibilidad y la mantenibilidad del código. A continuación se presentan las pautas de indentación y estilo:

- **Indentación**: Utilizar 4 espacios para la indentación. No usar tabulaciones.
- **Longitud de línea**: Limitar las líneas a 80 caracteres.
- **Nombres de variables**: Usar `snake_case` para nombres de variables y funciones. Ejemplo: `nombre_usuario`.
- **Nombres de clases**: Usar `PascalCase` para nombres de clases. Ejemplo: `UsuarioController`.
- **Comentarios**: Incluir comentarios claros y concisos para explicar el propósito del código.

## D. Ejemplos Aceptados y No Aceptados

### Ejemplos Aceptados

```python
def calcular_precio(total, impuesto):
    """Calcula el precio total incluyendo el impuesto."""
    return total + (total * impuesto)

class Usuario:
    def __init__(self, nombre):
        self.nombre = nombre
```
### Ejemplos  no Aceptados
```python
def calcularPrecio(Total, Impuesto):  # Mal estilo de nombres
    return Total + Total * Impuesto  # Falta de paréntesis para claridad

class usuario:  # Mal uso de minúsculas
    def __init__(self, Nombre):
        self.Nombre = Nombre  # Mal estilo de nombres
```