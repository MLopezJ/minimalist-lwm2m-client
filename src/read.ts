import { getURN } from '@nordicsemiconductor/lwm2m-types'
import chalk from 'chalk'
import coap from 'coap'
import { device, deviceObjects } from './deviceObjects'
import { createResourceArray } from './utils/createResourceArray'
import { element, getElementPath } from './utils/getElementPath'
import { requestParser } from './utils/requestParser'
import { typeOfElement, type elementType } from './utils/typeOfElement'

/**
 * Operation: Read
 * Interface: Dev Mang & Serv Enab
 */
export const read = async (port: number): Promise<void> => {
	console.log('')
	console.log(
		chalk.blue(`Operation: `),
		chalk.bgBlue('Read'),
		chalk.blue('\nInterface: '),
		chalk.bgBlue('Dev Mang & Serv Enab'),
		chalk.green(`\nstarting...`),
	)

	return new Promise<void>((resolve, reject) => {
		const udpDefault = 'udp4'
		const socket = coap.createServer({
			type: udpDefault,
			proxy: true,
		})

		socket.listen(port, (err: unknown) => {
			console.log(
				chalk.gray(
					' ',
					`Socket connection stablished: listening from port number: ${port}`,
				),
			)

			if (err !== undefined) reject(err)

			console.log(chalk.gray('  -', `LwM2M server requests:`))
		})

		socket.on('request', async (request, response) => {
			const action = requestParser(request)
			const url = request.url

			let result: Buffer = Buffer.from('')

			if (action === 'read') {
				result = await readObjectValue(url, deviceObjects)
			}

			/**
			 * Json as IANA Media Type
			 * @see http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf Page 48
			 */
			const json = 'application/vnd.oma.lwm2m+json'
			response.setOption('Content-Format', json)
			response.end(result)
			console.log(chalk.gray('    -'), chalk.green('✔'), chalk.gray(`${action} ${url}`))
			resolve()
		})
	})
}

/**
 * Read value from requested URL and transform it to vnd.oma.lwm2m+json format
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 */
export const readObjectValue = async (
	url: string,
	objectList: object,
): Promise<Buffer> => {
	const elementPath = getElementPath(url)
	let urn = await getURN(`${elementPath.objectId}`)

	if (urn === undefined) {
		if (isObjectIndevice(`${elementPath.objectId}`) === false)
			return Buffer.from(JSON.stringify({ bn: null, e: null }))

		// * if urn is not found in LwM2M-types lib but object id is part of Asset Tracker, it means the object is a custom object of Asset Tracker v2
		urn = `${elementPath.objectId}`
	}

	const object = objectList[
		`${urn as keyof typeof objectList}`
	] as Partial<device>
	const elementType = typeOfElement(url)

	const data = createLwm2mJsonFormat(
		url,
		Math.floor(Date.now() / 1000),
		object,
		elementType,
		elementPath,
	)

	return Buffer.from(JSON.stringify(data))
}

/**
 * Given the URN of the object check if it is part of the Asset Tracker v2
 */
export const isObjectIndevice = (objectId: string): boolean =>
	Object.keys(deviceObjects).includes(objectId)

/**
 * Create the application/vnd.oma.lwm2m+json content format
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 */
export const createLwm2mJsonFormat = (
	url: string,
	time: number,
	object: undefined | Partial<device>,
	elementType: elementType | undefined,
	elementPath: element,
): any => {
	return {
		bn: url,
		bt: time,
		e:
			elementType !== undefined
				? createResourceArray(
						object ?? {},
						elementType,
						Math.floor(Date.now() / 1000),
						elementPath,
				  )
				: [],
	}
}
