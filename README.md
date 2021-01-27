# Repositorio backend del microservicio viajes.

Proyecto Fundamentos de Ingeniería del Software para Cloud

Equipo 4 - Urbanio

Autores:
Javier Ortiz
José Enrique Sánchez

## Funcionalidades adicionales implementadas:

- Integrados en el frontend común con rutas y navegación. Una ruta con funcionalidades para usuarios de tipo USER y otra ruta con funcionalidades para usuarios de tipo ADMIN.

- Implementación de pruebas en la interfaz de usuario.

- Integrados con API Gateway para centralizar un servicio de autenticación con dos tipos de permisos USER y ADMIN.

- Documentación de la api a través de swagger (fichero swagger.yml) y plenamente operativa a través del editor online de swagger (ttps://editor.swagger.io/).

- En sustitución de la validación no trivial de los formularios del front-end que han hecho el resto de nuestros compañeros, puesto que no tenía sentido implementarlo en nuestro   microservicio, hemos llevado a cabo el desarrollo del cronómetro .

## Esfuerzo y reparto de tareas:

- Javier Ortiz:
  Implementación de la persistencia.
  Métodos de la API (server.js)
  Testeo e integración continua.
  
- José Enrique Sánchez:
  Implementación del frontend con rutas y navegación.
  Integración con API gateway y autenticación.
  Integración con microservicios vehiculos y facturacion.
  Documentación de la API a través de swagger


