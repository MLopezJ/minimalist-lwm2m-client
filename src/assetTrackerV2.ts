import type {
	Device_3,
	LwM2MDocument,
	LwM2MServer_1,
} from '@nordicsemiconductor/lwm2m-types'

import {
	Device_3_urn,
	LwM2MServer_1_urn,
} from '@nordicsemiconductor/lwm2m-types'

/**
 * LwM2M Security
 *
 * This LwM2M Object provides the keying material of a LwM2M Client appropriate to access a specified LwM2M Server.
 *
 * @see https://github.com/OpenMobileAlliance/lwm2m-registry/raw/prod/0.xml
 *
 * ID: 0
 * LWM2MVersion: 1.1
 * ObjectVersion: 1.2
 * MultipleInstances: true
 * Mandatory: true
 */
type Security_0 = Readonly<
	Array<{
		'0': string
		'1': boolean
		'2': number
		'3': string
		'4': string
		'5': string
		'10'?: number
	}>
>

/**
 * Security
 */
const security: Security_0 = [
	{
		'0': 'coap://eu.iot.avsystem.cloud:5683', // LWM2M  Server URI  - Coiote
		'1': false, // Bootstrap-Server
		'2': 3, // Security Mode
		'3': '', // Public Key or Identity
		'4': '', // Server Public Key
		'5': '', // Secret Key
		'10': 1, // Short Server ID
	},
]

/**
 * Server
 */
const server: LwM2MServer_1 = [
	{
		'0': 1, // Short Server ID
		'1': 60, // Lifetime --> During "Register" or "Update" operations, the parameter Lifetime – if present – MUST match the current value of the Mandatory Lifetime Resource of the LwM2M Server Object Instance
		'6': false, // Notification Storing When Disabled or Offline
		'7': 'U', // Binding
		//8: "true",// --> commented because of an issue with Registration Update Trigger
		'23': false,
	},
]

/**
 * Device
 */
const device: Device_3 = {
	'0': 'Nordic', // Manufacturer
	'1': '00010', // Model Number
	'2': '00000', // Serial Number
	'3': '0.0', // Firmware Version
	'6': 1, // Available Power Sources
	'7': 0, // Power Source Voltage
	'9': 80, // Battery Level
	'11': 0, // error code
	'13': 1651820400, // Current Time
	'16': 'U', // Supported Binding and Modes
	'18': '0.0', // hardware version
	'19': '0.0', // software version
}


export const lwm2mObjects: LwM2MDocument = {
	[LwM2MServer_1_urn]: server,
	[Device_3_urn]: device,
}

export type device = {
	'0': Security_0
} & LwM2MDocument

export const deviceObjects: device = {
	'0': security,
	...lwm2mObjects,
}