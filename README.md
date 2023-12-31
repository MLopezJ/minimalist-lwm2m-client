# Minimalist LwM2M Client

[![Test and Release](https://github.com/MLopezJ/minimalist-lwm2m-client/actions/workflows/test-and-release.yaml/badge.svg)](https://github.com/MLopezJ/minimalist-lwm2m-client/actions/workflows/test-and-release.yaml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

a minimal LwM2M client which performe the following operations:

- `Client registration` from `Register` interface
- `Discover` from `Dev Mang & Serv Enab` interface
- `Read` from `Dev Mang & Serv Enab` interface
- `Send` from `Information Reporting` interface

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

## Usage

1. Create a device in coiote using No-Sec security mode
2. Update value of `deviceName` with the name of the device just created in
   Coiote.
   [deviceName](https://github.com/MLopezJ/minimalist-lwm2m-client/blob/saga/src/index.ts#L7)
3. Runs execution command

## Description

After the execution is initialized, the device send a register operation to the
LwM2M server and wait for the response. If the server accept the registratrion
request, the client open a socket connection to hear about Discover and Read
operation. After that, the device wait 10 seconds and onces the time is expired,
the device trigger a send operation to update the value of resource `/3/0/0`.

### Client Registration from Register interface

This action is executed by the LwM2M client, in this case this device.

#### Details

- **host**: `eu.iot.avsystem.cloud`
- **port**: `5683`
- **method**: `POST`
- **pathname**: `/rd`
- **query**: `ep=xxxx&lt=xxxx&lwm2m=xxxx&b=xxxx`, where:
  - `ep` is the name of the device
  - `lt` is the lifetime of the opening conenction
  - `lwm2m` is the version of the protocol suported by the device
  - `b` stands for biding mode
- **payload**: `</>;ct=110,112,11543;hb,<1/0>, <3/0>` , where:
  - `ct` stands for content type
  - `110` is the id of SenML JSON
  - `112` is the id of SenML CBOR
  - `11543` is the id of LwM2M JSON

If request is successful, it returns a port number.

### Discover from Dev Mang & Serv Enab interface

This action is triggered by the server, in this case Coiote, and the client
should listen from the port returned in the Client Registration operation in
order to receive the request.

### Discover from Dev Mang & Serv Enab interface

This action is triggered by the server, in this case Coiote, and the client
should listen from the port returned in the Client Registration operation in
order to receive the request.

#### Details

- **port**: the one returned in Client Registration operation from Register
  interface
- **content-format**: 'application/vnd.oma.lwm2m+json'
- **payload**:
  ```JavaScript
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

### Send from Information Reporting interface

This action is executed by the LwM2M client, in this case this device.

#### Details

- **host**: `eu.iot.avsystem.cloud`
- **port**: `5683`
- **method**: `POST`
- **pathname**: `/dp`
- **content-format**: `application/senml+cbor` & `application/senml+json`
- **payload**:

```JavaScript
  // for application/senml+cbor'
  81 a2 00 66 2f 33 2f 30 2f 30 03 6f 6e 65 77 4d 61 6e 75 66 61 63 74 75 72 65 72
  // { 0: '/3/0/0', 3: 'newManufacturer' }
```

or

```JavaScript
  // for application/senml+json
  [{ 'n': '/3/0/0', 'vs': newManufacturer }]
```

#### Links

- Code: [send.ts](src/send.ts)
- Documentation:
  [Information Reporting Interface](https://www.openmobilealliance.org/release/LightweightM2M/V1_2-20201110-A/HTML-Version/OMA-TS-LightweightM2M_Transport-V1_2-20201110-A.html#6-4-5-0-645-Information-Reporting-Interface:~:text=Asynchronous%20Response-,Send,-POST%0AContent%20Format)
  ,
  [Send Operation, pag 61](https://www.openmobilealliance.org/release/LightweightM2M/V1_1_1-20190617-A/OMA-TS-LightweightM2M_Core-V1_1_1-20190617-A.pdf)
