# BCCR indicadores económicos

Interfaz para consumo del servicio web de indicadores económicos del Banco Central de Costa Rica (BCCR).

## Pre-requisitos

### Registro a servicio web de indicadores económicos del BCCR

Para la recuperación de indicadores económicos es necesario el registro ante la entidad bancaria, este procedimiento se puede realizar llenando el siguiente formulario: [Formulario de registro a servicio web BCCR](https://www.bccr.fi.cr/indicadores-economicos/servicio-web). 

**El correo electrónico registrado en el servicio web así como el _token_ generado por el servicio web del BCCR son necesarios para el funcionamiento de esta biblioteca.**
 
## Tabla de contenidos

- [BCCR indicadores económicos](#BCCR-indicadores-económicos)
    - [Pre-requisitos](#pre-requisitos)
      - [Registro a servicio web de indicadores económicos del BCCR](#registro-a-servicio-web-de-indicadores-económicos-del-BCCR)
      
    - [Tabla de contenidos](#tabla-de-contenidos) 
    - [Instalación](#instalación)
    - [Uso](#uso)
        - [Importación](#importación)
        - [Intancia de objeto BCCRWebService](#intancia-de-objeto-BCCRWebService)
        - [Recuperar el valor actual de un indicador](#recuperar-el-valor-actual-de-un-indicador)
        - [Recuperar el valor de un indicador en una fecha específica](#recuperar-el-valor-de-un-indicador-en-una-fecha-específica)
        - [Recuperar el valor de un indicador en un rango de fechas](#recuperar-el-valor-de-un-indicador-en-un-rango-de-fechas)
        - [Recuperar el valor de un indicador compuesto](#recuperar-el-valor-de-un-indicador-en-un-rango-de-fechas)
    - [Lista de indicadores públicos](#lista-de-indicadores-públicos)
    - [Limitaciones](#limitaciones)
    - [Versionamiento](#versionamiento) 
    - [Autor](#autor)
    - [Licencia](#licencia)


## Instalación

Instale la biblioteca ejecutando en el directorio de su proyecto el comando:

```sh
$ npm install bccr-indicadores-economicos
```

## Uso

**ANTES DE UTILIZAR:** Completar registro ante BCCR como se indica en los [pre-requisitos](#pre-requisitos) y chequear la lista de indicadores públicos en [lista de indicadores públicos](#lista-de-indicadores-públicos).

### Importación

#### No ES6

```js
const BCCRWebService = require('bccr-indicadores-economicos');
```

##### ES6

```js
import BCCRWebService from 'bccr-indicadores-economicos';
```

### Intancia de objeto BCCRWebService

Para la instanciación del objeto _BCCRWebService_ se debe ingresar el correo electrónico registrado ante el Banco Central y el _token_ generado por el sistema. Se recomienda almacenar estas credenciales de manera segura en variables del entorno (consultar biblioteca [dotenv](https://www.npmjs.com/package/dotenv)).

```js
const bccrWS = new BCCRWebService('ejemplo@email.com','EJEMPLOTOKEN');
```

Este objeto cuenta con un único método asincrónico: `request(code, startDate, endDate, compound)` el cual permitirá la recuperación de indicadores económicos del servicio web del BCCR.

### Recuperar el valor actual de un indicador

Utilice el método asincrónico `bccrWS.request(code)` para recuperar el valor actual (último valor publicado por el BCCR) de un indicador económico.

```js
// Ejemplo con código 318: Tipo de cambio venta dólar/colón.
const currentColonDollarSellPrice = await bccrWS.request('318');
```

Como resultado del extracto de código anterior el valor contenido en la constante `currentColonDollarSellPrice` tiene una estructura tal como la siguiente:

```js
{ code: '318', date: '2024-02-26T00:00:00-06:00', value: 511.27 }
```

### Recuperar el valor de un indicador en una fecha específica

Utilice el método asincrónico `bccrWS.request(code, startDate, endDate)` para recuperar el valor de un indicador económico en una fecha específica. El valor asignado a los parametros `startDate` y `endDate` debe de ser el mismo. 

```js
// Fecha que de la cual desea recuperar el indicador económico.
const targetDate = new Date(2024, 0, 1);
// Ejemplo con código 318: Tipo de cambio venta dólar/colón.
const singleColonDollarSellPrice = await bccrWS.request('318', targetDate, targetDate);
```

Como resultado del extracto de código anterior el valor contenido en la constante `singleColonDollarSellPrice` tiene una estructura tal como la siguiente:


```js
{ code: '318', date: '2024-01-01T00:00:00-06:00', value: 519.21 }
```

### Recuperar el valor de un indicador en un rango de fechas

Utilice el método asincrónico `bccrWS.request(code, startDate, endDate)` para recuperar el valor de un indicador económico en un rango de fechas.

```js
// Fecha que de inicio del rango que se desea recuperar.
const startDate = new Date(2024, 0, 1);
// Fecha que de fin del rango que se desea recuperar.
const endDate = new Date(2024, 0, 5);
// Ejemplo con código 318: Tipo de cambio venta dólar/colón.
const rangedColonDollarSellPrice = await bccrWS.request('318', startDate, endDate);
```

Como resultado del extracto de código anterior el valor contenido en la constante `rangedColonDollarSellPrice` tiene una estructura tal como la siguiente:


```js
[{ code: '318', date: '2024-01-01T00:00:00-06:00', value: 519.21 },
    { code: '318', date: '2024-01-02T00:00:00-06:00', value: 519.21 },
    { code: '318', date: '2024-01-03T00:00:00-06:00', value: 518.92 },
    { code: '318', date: '2024-01-04T00:00:00-06:00', value: 518.01 },
    { code: '318', date: '2024-01-05T00:00:00-06:00', value: 516.88 }]
```

### Recuperar valores compuestos

Para aquellos indicadores de estructura de datos compuestas utilice el método asincrónico `bccrWS.request(code, startDate, endDate, compound)` para recuperar la jerarquía asociada al indicador económico. El parámentro `compound` es de tipo boleano y por defecto asignado en falso. 

```js
// Fecha que de inicio del rango que se desea recuperar.
const startDate = new Date(2024, 0, 1);
// Fecha que de fin del rango que se desea recuperar.
const endDate = new Date(2024, 0, 5);
// Ejemplo con código 25633: Curvas de rendimiento soveranas (indicador compuesto).
const compoundColonDollarSellPrice = await bccrWS.request('25633', startDate, endDate, true);
```

## Lista de indicadores públicos

Listado de indicadores económicos populares:

| Código | Descripción                        |
|--------|------------------------------------|
| 317    | Tipo de cambio: compra colón/dólar |
| 318    | Tipo de cambio: venta colón/dólar |
| 3323   | Tipo de cambio: promedio MONEX     |
| 23698   | TED: Tasa Efectiva en Dólares      |
| 3541   | TPM: Tasa de Política Monetaria    |
| 423   | TBP: Tasa Básica Pasiva            |

Para obtener el listado completo de indicadores económicos públicos en el servicio web del BCCR consulte el siguiente archivo: [Lista de indicadores públicos BCCR](https://gee.bccr.fi.cr/Indicadores/Suscripciones/UI/ConsultaIndicadores/ObtenerArchivo).

## Limitaciones
**ESTA BIBLIOTECA ESTÁ DESARROLLADA PARA SU USO EXCLUSIVO DESDE EL LADO DEL SERVIDOR**. 

Debido al bloqueo solicitudes de origen cruzado (_CORS_), toda petición debe ejecutarse desde un servidor web. Por lo tanto, su implementación desde el lado del cliente (_frontend_) ocasionrá problemas al momento de solicitar recursos desde un buscador web al servicio web del BCCR. 

## Versionamiento

El sistema de versionamiento utilizado para esa biblioteca es [SemVer](http://semver.org/). 

## Autor

**Andrés Montero Gamboa**<br>
Estudiante de ingeniería en computación<br>
Instituto Tecnológico de Costa Rica<br>
[LinkedIn](www.linkedin.com/in/andres-montero-gamboa) | [GitHub](https://github.com/andresmg07)

## Licencia

MIT License

Copyright (c) 2024 Andrés Montero Gamboa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
