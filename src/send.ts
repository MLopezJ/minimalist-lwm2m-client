import coap from 'coap'
import { type CoapMethod } from 'coap-packet'

/**
 * Performe Send operation from Information Reporting interface.
 *
 * To keep the scope of the implementation small, this method is only able
 * to update the value of the resource 0 (Manufacturer) of object 3 (Device)
 */
export const send = async ({
	newManufacturer,
	cbor,
	test,
}: {
	newManufacturer: string
	cbor: boolean
	test: boolean
}): Promise<void> => {
	console.log('\nSend operation from Information Reporting interface: start')
	console.log(`\nFormat: ${cbor === true ? 'cbor' : 'json'}`)
	const jsonValue = Buffer.from(
		JSON.stringify([{ n: '/3/0/0', vs: newManufacturer }]),
	)
	const payload = cbor === true ? getCborValue(newManufacturer) : jsonValue
	const host = test === false ? 'eu.iot.avsystem.cloud' : 'localhost'
	const params = {
		host,
		port: 5683,
		pathname: '/dp',
		method: 'POST' as CoapMethod,
		options: {
			'Content-Format':
				cbor === true ? 'application/senml+cbor' : 'application/senml+json',
		},
	}
	const agent = new coap.Agent({ type: 'udp4' })
	const request = agent.request(params).end(payload)

	const serverResponse = new Promise<coap.IncomingMessage>(
		(resolve, reject) => {
			const t = setTimeout(
				() => reject(new Error('timeout in send operation')),
				10 * 1000,
			)
			request.on('response', (response) => {
				clearTimeout(t)
				if (response.code === '2.01' || response.code === '2.05') {
					return resolve(response)
				}
				console.log(response)
				return reject(new Error('Server does not accept the request'))
			})
		},
	)

	console.log('\nSend operation from Information Reporting interface: end')
	await serverResponse
		.then((value) => console.log('\nValue: ', value))
		.catch((err) => console.log('\nError: ', err))
}

/**
 * Set senml+cbor format
 */
const getCborValue = (newManufacturer: string): Buffer => {
	/*
	const map = new Map()
		.set(-2, '/3/0') // base name
		.set(0, '/0') // name
		.set(-3, 1688129143.99978) // base time
		.set(3, newManufacturer) // string value
		*/
	/*
	
	const sensor = new Map()
		.set(-2, '/3303/0') // base name
		.set(0, '/5700') // name
		.set(-3, 1688129143.99978) // base time
		.set(2, 14.0) // string value
	const units = new Map()
	.set(0, '/5701') // name
	.set(3, 'Cel') // string value
	const cborValue = cbor.encode([sensor, units])
	return cborValue
	*/

	return Buffer.from(
		'00155de3639b00155d81dd0108004500005d7697400040113554ac19914023cc2d7f940c163300498eff48026de57076c3ee8d9797b8b264701170ff82a421672f333330332f3000652f3537303022fb41d927b39dfffc5502fa41600000a200652f35373031036343656c',
		'hex',
	)
}
