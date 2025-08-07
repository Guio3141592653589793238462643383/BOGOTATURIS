# Git Workflow

## Convención de Commits
- Usar imperativos en los mensajes de commit (por ejemplo, "Agrega nueva funcionalidad" en lugar de "Se agregó nueva funcionalidad")
- Limitar el mensaje principal a 50 caracteres
- Incluir más detalles en el cuerpo del commit si es necesario
- Utilizar prefijos para indicar el tipo de cambio (fix, feat, docs, etc.)

## Frecuencia de Push/Pull
- Hacer push de los cambios al final de cada tarea o funcionalidad completada
- Hacer pull antes de comenzar a trabajar en una nueva tarea, para asegurarse de tener la última versión del código
- Establecer una frecuencia mínima de pull (por example, al menos una vez al día)
- Evitar hacer push de cambios incompletos o que puedan romper la rama principal

## Flujo de Trabajo
1. Crear una nueva rama a partir de la rama `develop` (por ejemplo, `feature/nueva-funcionalidad`)
2. Realizar los cambios, incluido agregar un nuevo archivo, y hacer commits siguiendo la convención establecida
3. Hacer push de la rama a origin
4. Crear una solicitud de extracción (pull request) en GitHub, apuntando a la rama `develop`
5. Solicitar revisión y aprobación de los cambios
6. Una vez aprobados, fusionar la rama a la rama `develop`
7. Cuando se considere que la rama `develop` está lista, fusionarla a la rama `main`
8. Eliminar la rama de característica

## Ramas
- `main`: Rama principal, donde se fusionan los cambios aprobados
- `develop`: Rama de desarrollo, donde se integran las características antes de pasar a `main`
- `feature/*`: Ramas de características, donde se desarrollan nuevas funcionalidades
- `hotfix/*`: Ramas de corrección de errores urgentes, que se fusionan directamente a `main`
