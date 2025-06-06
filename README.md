# BCCR indicadores económicos

Interfaz para consumo del servicio web de indicadores económicos del Banco Central de Costa Rica (_BCCR_).

[![npm version](https://badge.fury.io/js/bccr-indicadores-economicos.svg)](https://badge.fury.io/js/bccr-indicadores-economicos)
[![npm](https://img.shields.io/npm/dm/bccr-indicadores-economicos.svg)](https://www.npmjs.com/package/bccr-indicadores-economicos)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/bccr-indicadores-economicos)
![NPM License](https://img.shields.io/npm/l/bccr-indicadores-economicos)
[![code style: prettier](https://img.shields.io/badge/Prettier-Prettier?style=flat&logo=prettier&logoColor=white&labelColor=%23bf85bf&color=%23bf85bf)](https://github.com/prettier/prettier)
[![language: typescript](https://img.shields.io/badge/TypeScript-typescript?style=flat&logo=typescript&logoColor=white&labelColor=%233178C6&color=%233178C6)](https://www.typescriptlang.org/)


## Pre-requisitos

### Registro a servicio web de indicadores económicos del _BCCR_

Es necesario el registro en el servicio web del _BCCR_: [Formulario de registro a servicio web _BCCR_](https://www.bccr.fi.cr/indicadores-economicos/servicio-web).

**El correo electrónico registrado y el _token_ generado por el servicio web del _BCCR_ son necesarios para el funcionamiento de esta biblioteca.**

## Tabla de contenidos

-   [_BCCR_ indicadores económicos](#BCCR-indicadores-económicos)
    -   [Pre-requisitos](#pre-requisitos)
        -   [Registro a servicio web de indicadores económicos del _BCCR_](#registro-a-servicio-web-de-indicadores-económicos-del-BCCR)
    -   [Tabla de contenidos](#tabla-de-contenidos)
    -   [Instalación](#instalación)
    -   [Uso](#uso)
        -   [Importación](#importación)
        -   [Clase _BCCRWebService_](#Clase-BCCRWebService)
        -   [Recuperar el valor actual de un indicador](#recuperar-el-valor-actual-de-un-indicador)
        -   [Recuperar el valor de un indicador en una fecha específica](#recuperar-el-valor-de-un-indicador-en-una-fecha-específica)
        -   [Recuperar el valor de un indicador en un rango de fechas](#recuperar-el-valor-de-un-indicador-en-un-rango-de-fechas) 
    -   [Lista de indicadores públicos](#lista-de-indicadores-públicos)
    -   [Limitaciones](#limitaciones)
    -   [Versionamiento](#versionamiento)
    -   [Autor](#autor)
    -   [Licencia](#licencia)

## Instalación

```sh
$ npm install bccr-indicadores-economicos
```

## Uso

**ANTES DE UTILIZAR:** Completar los pasos indicados en [pre-requisitos](#pre-requisitos) y chequear la lista de indicadores públicos en [lista de indicadores públicos](#lista-de-indicadores-públicos).

### Importación

#### No ES6

```js
const BCCRWebService = require("bccr-indicadores-economicos");
```

#### ES6

```js
import BCCRWebService from "bccr-indicadores-economicos";
```

### Clase _BCCRWebService_

El constructor de la clase _BCCRWebService_ recibe como parámetros el correo electrónico registrado y el _token_ generado por el sistema del Banco Central.

```js
const bccrWS = new BCCRWebService("ejemplo@email.com", "EJEMPLOTOKEN");
```

Esta clase cuenta con un único método: `request` el cual es **asincrónico y sobrecargado**.

```js
request(code)
request(code, targetDate)
request(code, startDate, endDate)
```

### Recuperar el valor actual de un indicador

Utilice el método `bccrWS.request(code)` para recuperar el valor actual (último valor publicado por el _BCCR_) de un indicador económico.

```js
// Ejemplo con código 318: Tipo de cambio venta dólar/colón.
const currentColonDollarSellPrice = await bccrWS.request("318");
```

#### Resultado

```js
{ code: '318', date: '2024-02-26T00:00:00-06:00', value: 511.27 }
```

### Recuperar el valor de un indicador en una fecha específica

Utilice el método `bccrWS.request(code, targetDate)` para recuperar el valor de un indicador económico en una fecha específica. 

```js
// Fecha que de la cual desea recuperar el indicador económico.
const targetDate = new Date(2024, 0, 1);
// Ejemplo con código 318: Tipo de cambio venta dólar/colón.
const singleColonDollarSellPrice = await bccrWS.request( "318", targetDate);
```

#### Resultado

```js
{ code: '318', date: '2024-01-01T00:00:00-06:00', value: 519.21 }
```

### Recuperar el valor de un indicador en un rango de fechas

Utilice el método `bccrWS.request(code, startDate, endDate)` para recuperar el valor de un indicador económico en un rango de fechas.

```js
// Fecha que de inicio del rango que se desea recuperar.
const startDate = new Date(2024, 0, 1);
// Fecha que de fin del rango que se desea recuperar.
const endDate = new Date(2024, 0, 5);
// Ejemplo con código 318: Tipo de cambio venta dólar/colón.
const rangedColonDollarSellPrice = await bccrWS.request(
    "318",
    startDate,
    endDate,
);
```

#### Resultado

```js
[
    { code: "318", date: "2024-01-01T00:00:00-06:00", value: 519.21 },
    { code: "318", date: "2024-01-02T00:00:00-06:00", value: 519.21 },
    { code: "318", date: "2024-01-03T00:00:00-06:00", value: 518.92 },
    { code: "318", date: "2024-01-04T00:00:00-06:00", value: 518.01 },
    { code: "318", date: "2024-01-05T00:00:00-06:00", value: 516.88 },
]
```

## Lista de indicadores públicos

Listado de indicadores económicos populares:

| Código | Descripción                        |
| ------ | ---------------------------------- |
| 317    | Tipo de cambio: compra colón/dólar |
| 318    | Tipo de cambio: venta colón/dólar  |
| 3323   | Tipo de cambio: promedio MONEX     |
| 23698  | TED: Tasa Efectiva en Dólares      |
| 3541   | TPM: Tasa de Política Monetaria    |
| 423    | TBP: Tasa Básica Pasiva            |

Para obtener el listado completo de indicadores económicos públicos en el servicio web del _BCCR_ consulte el siguiente archivo: [Lista de indicadores públicos _BCCR_](https://gee.bccr.fi.cr/Indicadores/Suscripciones/UI/ConsultaIndicadores/ObtenerArchivo).

## Limitaciones

**ESTA BIBLIOTECA ESTÁ DESARROLLADA PARA SU USO DESDE EL LADO DEL SERVIDOR**.

Debido al bloqueo solicitudes de origen cruzado (_CORS_), toda petición debe ejecutarse desde un servidor web. Aquellas llamadas provenientes de un cliente (buscador web) serán rechazadas por el _BCCR_.

## Versionamiento

El sistema de versionamiento utilizado para esa biblioteca es [SemVer](http://semver.org/).

## Autor

**Andrés Montero Gamboa**<br>
Ingeniero en computación<br>
Graduado del Tecnológico de Costa Rica (TEC)<br>
[LinkedIn](https://www.linkedin.com/in/andres-montero-gamboa) | [GitHub](https://github.com/andresmg07)

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
