<!-- PROJECT SHIELDS -->
[![NPM][npm-shield]](https://www.npmjs.com/package/@afipsdk/afip.js)
[![Contributors][contributors-shield]](https://github.com/afipsdk/afip.js/graphs/contributors)
[![Closed issues][issues-shield]](https://github.com/afipsdk/afip.js/issues)
[![License][license-shield]](https://github.com/afipsdk/afip.js/blob/master/LICENSE)

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <img src="https://static.autogestiones.com.ar/resource/logo.png" width="320" alt="Autogestiones Logo" /> 
</p>

  <h3 align="center">Afip-exp.js</h3>

  <p align="center">
    Librería para conectarse al Web Service de Factura Electrónica de Exportación V1
    <br />
    <a href="https://github.com/autogestiones/afip-exp.js/issues">Reportar un bug</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
## Tabla de contenidos

* [Acerca del proyecto](#acerca-del-proyecto)
* [Guia de inicio](#guia-de-inicio)
  * [Instalacion](#instalacion)
  * [Como usarlo](#como-usarlo)
* [Web Services](#web-services)
  * [Factura electronica](#factura-electronica)
  * [Factura electronica de exportación](#factura-electronica-de-exportacion)
* [¿Necesitas implementarlo? 🚀](#necesitas-ayuda-)
* [Licencia](#licencia)
* [Contacto](#contacto)



<!-- ABOUT THE PROJECT -->
## Acerca del proyecto
Afip SDK es la forma más rápida y simple de conectarse con los Web Services de AFIP.

Esta librería fue creada con la intención de ayudar a los programadores a usar los Web Services de AFIP sin romperse la cabeza ni perder tiempo tratando de entender la complicada documentación que AFIP provee. Ademas forma parte de [Afip SDK](https://afipsdk.com/).


<!-- START GUIDE -->
## Guia de inicio

### Instalacion
#### Via npm

```
npm install --save @autogestiones/afip-exp.js
```

**Siguiente paso** 
* Remplazar *node_modules/@afipsdk/afip.js/Afip_res/cert* por tu certificado provisto por AFIP y *node_modules/@afipsdk/afip.js/Afip_res/key* por la clave generada. 
* La carpeta *Afip_res* deberá tener permisos de escritura.

Ir a http://www.afip.gob.ar/ws/documentacion/certificados.asp para obtener mas información de como generar la clave y certificado

# Como usarlo

Lo primero es incluir el SDK en tu aplicación
````js
const Afip = require('@afipsdk/afip.js');
````

Luego creamos una instancia de la clase Afip pasandole un Objeto como parámetro.
````js
const afip = new Afip({ CUIT: 20111111112 });
````

Para más información acerca de los parámetros que se le puede pasar a la instancia new `Afip()` consulte sección [Primeros pasos](https://github.com/afipsdk/afip.js/wiki/Primeros-pasos#como-usarlo) de la documentación

Una vez realizado esto podemos comenzar a usar el SDK con los Web Services disponibles

<!-- WEB SERVICES -->
## Web Services

Si necesitas más información de cómo utilizar algún web service echa un vistazo a la [documentación completa de afip.js](https://github.com/afipsdk/afip.js/wiki)

### Factura electronica
Podes encontrar la documentación necesaria para utilizar la [facturación electrónica](https://github.com/afipsdk/afip.js/wiki/Facturaci%C3%B3n-Electr%C3%B3nica) 👈 aquí

### Factura electronica de exportación
Podes encontrar la documentación necesaria para utilizar la [facturación electrónica exportación](https://www.afip.gob.ar/fe/documentos/WSFEX-Manualparaeldesarrollador_V1_9.pdf)

<!-- AFIP SDK PRO -->
### ¿Necesitas ayuda? 🚀

¿Quieres implementarlo de forma rápida y fácil? Prueba Autogestiones

**[Saber más](https://www.autogestiones.net/)**


<!-- LICENCE -->
### Licencia
Distribuido bajo la licencia MIT. Vea `LICENSE` para más información.


<!-- CONTACT -->
### Contacto
Autogestiones - contacto@autogestiones.net

Link del proyecto: [https://github.com/autogestiones/afip-exp.js](https://github.com/autogestiones/afip-exp.js)

_Este software y sus desarrolladores no tienen ninguna relación con la AFIP._
 