import cbor from 'cbor'
import coap from 'coap'
import { type CoapMethod } from 'coap-packet'

export type sendParams  = {
	newManufacturer: string
	cbor: boolean
	test: boolean
}

/**
 * Performe Send operation from Information Reporting interface.
 *
 * To keep the scope of the implementation small, this method is only able
 * to update the value of the resource 0 (Manufacturer) of object 3 (Device)
 */
export const send = async (_: sendParams): Promise<void> => { // TODO: change any
	console.log('\nSend operation from Information Reporting interface: start')
	console.log(`\nFormat: ${_.cbor === true ? 'cbor' : 'json'}`)
	const jsonValue = Buffer.from(
		JSON.stringify([{ 'n': '/3/0/0', 'vs': _.newManufacturer }]),
	)
	const payload = _.cbor === true ? getCborValue(_.newManufacturer) : jsonValue
	const host = _.test === false ? 'eu.iot.avsystem.cloud' : 'localhost'
	const params = {
		host,
		port: 5683,
		pathname: '/dp',
		method: 'POST' as CoapMethod,
		options: {
			'Content-Format':
				_.cbor === true ? 'application/senml+cbor' : 'application/senml+json',
		},
	}
	const agent = new coap.Agent({ type: 'udp4' })
	const request = agent.request(params).end(payload)

	const serverResponse = new Promise<coap.IncomingMessage>(
		(resolve, reject) => {
			const t = setTimeout(() => reject(new Error('timeout in send operation')), 10 * 1000)
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
	// [{ 'n': '/3/0/0', 'vs': newManufacturer }]
	const map = new Map().set(0, '/3/0/0').set(3, newManufacturer)
	const cborValue = cbor.encode([map])
	return cborValue
}
