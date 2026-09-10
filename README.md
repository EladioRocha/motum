# motum

Aplicación web con frontend HTML/CSS/JavaScript y backend Express. Incluye pantallas de acceso, perfil, mapa e historial, autenticación y acceso a MongoDB.

## Estructura

- [api](api)
- [examples](examples)
- [helpers](helpers)
- [logs](logs)
- [public](public)
- [routes](routes)
- [views](views)
- [index.js](index.js)
- [server.js](server.js)

## Preparación y uso

### Raíz del repositorio

Requiere Node.js. Este paquete no fija una versión del runtime; valida compatibilidad con las dependencias antes de actualizarlo.

```sh
npm ci
npm run start
```

Comandos declarados en [package.json](package.json):

| Comando | Acción |
| --- | --- |
| `npm run test` | `echo "Error: no test specified" && exit 1` |
| `npm run start` | `node index.js` |

El script `test` es un marcador inicial, no una suite de pruebas.

## Configuración detectada en el código

Estas son referencias explícitas a variables de entorno, no una garantía de que toda la configuración esté externalizada. Los nombres y archivos permiten localizar dónde se usan; los valores deben corresponder a tu entorno.

| Variable | Referencia |
| --- | --- |
| `DB_DEV` | [index.js](index.js) |
| `JWT_KEY_DEV` | [api/controllers/user.js](api/controllers/user.js) |
| `PORT_DEV` | [index.js](index.js) |

No guardes credenciales reales en la documentación. Si hay `.env.example`, úsalo como referencia y revisa cómo carga la configuración el punto de entrada.

## Validación y estado

Esta guía se contrastó con el árbol de archivos y los manifiestos del repositorio. No se ha validado una ejecución completa contra servicios externos, bases de datos o hardware. Las versiones y los scripts mostrados describen el código actual; no implican que sus dependencias antiguas sigan siendo compatibles.

## Documentación previa

Se conserva como referencia histórica, incluidas las imágenes y atribuciones originales. Los enlaces a demos y servicios no se han comprobado.

# Motum
Project created for web development it is created with HTML, CSS and JS Vanilla and a little of jquery. The backend are created with **NodeJS**

**Landing Page**
![Landing page motum](https://github.com/EladioRocha/motum/blob/master/examples/result-1.png?raw=true)

**Login**
![Login page motum](https://github.com/EladioRocha/motum/blob/master/examples/result-2.png?raw=true)

**Map**
![Main page motum](https://github.com/EladioRocha/motum/blob/master/examples/result-3.png?raw=true)

**Travels - Community**
![Community page travels motum](https://github.com/EladioRocha/motum/blob/master/examples/result-4.png?raw=true)

**Travels - Actives**
![Actives page travels motum](https://github.com/EladioRocha/motum/blob/master/examples/result-5.png?raw=true)

**Travels - Pending**
![Pending page travels motum](https://github.com/EladioRocha/motum/blob/master/examples/result-6.png?raw=true)

**Travels - Finished**
![Finished page travels motum](https://github.com/EladioRocha/motum/blob/master/examples/result-7.png?raw=true)

**Travels - Requests**
![Requests page travels motum](https://github.com/EladioRocha/motum/blob/master/examples/result-8.png?raw=true)

**Account page**
![Account page motum](https://github.com/EladioRocha/motum/blob/master/examples/result-9.png?raw=true)
