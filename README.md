# Minimalist LwM2M Client

[![Test and Release](https://github.com/MLopezJ/minimalist-lwm2m-client/actions/workflows/test-and-release.yaml/badge.svg)](https://github.com/MLopezJ/minimalist-lwm2m-client/actions/workflows/test-and-release.yaml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://api.mergify.com/v1/badges/NordicSemiconductor/minimalist-lwm2m-client)](https://mergify.io)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)


a minimal LwM2M client which performe the following operations:

* `Client registration` from `Register` interface
* `Discover` from `Dev Mang & Serv Enab` interface
* `Read` from `Dev Mang & Serv Enab` interface
* `Send` from `Information Reporting` interface (triggered by the client)

## Installation

```
npm install
```

## Test

```
npm test
```


## Execution

```
npx tsx src/index.ts
```

## Description

### Client Registration from Register interface
This action is executed by the LwM2M client, in this case this device. 

#### Details 
* host: 'eu.iot.avsystem.cloud'
* port: 5683
* method: POST
* query: 'ep=xxxx&lt=xxxx&lwm2m=xxxx&b=xxxx', where:
  * `ep` is the name of the device
  * `lt` is the lifetime of the opening conenction
  * `lwm2m` is the version of the protocol suported by the device
  * `b` stands for biding mode
* payload: '</>;ct=110,112,11543;hb,<1/0>, <3/0>' , where:
  * `ct` stands for content type
  * 110 is the id of SenML JSON
  * 112 is the id of SenML CBOR
  * 11543 is the id of LwM2M JSON

If request is successful, it returns a port number.

### Discover from Dev Mang & Serv Enab interface
This action is triggered by the server, in this case Coiote, and the client should listen from the port returned in the Client Registration operation from Register interface in order to receive the request.

### Discover from Dev Mang & Serv Enab interface
This action is triggered by the server, in this case Coiote, and the client should listen from the port returned in the Client Registration operation from Register interface in order to receive the request.

#### Details 
* port: the one returned in Client Registration operation from Register interface
* content-format: 'application/vnd.oma.lwm2m+json'
* payload:
  ``` JavaScript
  {
  bn: '/3/0/',
  e: [
   { n: '0/0', sv: 'Nordic' },
   { n: '0/1', sv: '00010' },
   { n: '0/2', sv: '00000',},
   // ....
   ]
  }
  ```


## Usage
TODO
