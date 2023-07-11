import coap from 'coap'
import { type CoapMethod } from 'coap-packet'

/**
 * Performe Send operation from Information Reporting interface.
 *
 * To keep the scope of the implementation small, this method is only able
 * to update the value of the resource 0 (Manufacturer) of object 3 (Device)
 */
export const send = async (newManufacturer: string) => {
	console.log('\nSend operation from Information Reporting interface: start')
	const payload = [{ n: '/3/0/0', ['vs']: newManufacturer }]
	const params = {
		host: 'eu.iot.avsystem.cloud',
		port: 5683,
		pathname: '/dp',
		method: 'POST' as CoapMethod,
		options: {
			'Content-Format': 'application/senml+json',
		},
	}
	const agent = new coap.Agent({ type: 'udp4' })
	const request = agent.request(params).end(JSON.stringify(payload))

	const serverResponse = new Promise<coap.IncomingMessage>(
		(resolve, reject) => {
			const t = setTimeout(() => reject('timeout in send operation'), 10 * 1000)
			request.on('response', (response) => {
				clearTimeout(t)
				if (response.code === '2.01' || response.code === '2.05') {
					return resolve(response)
				}
				return reject(new Error('Server does not accept the request'))
			})
		},
	)

	console.log('\nSend operation from Information Reporting interface: end')
	await serverResponse
		.then((value) => console.log('\nValue: ', value))
		.catch((err) => console.log('\nError: ', err))
}
