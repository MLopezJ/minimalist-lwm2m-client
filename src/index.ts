import { read } from './read'
import { registration } from './registration'
import { send } from './send'

const main = async () => {
	const device = {
		deviceName: 'urn:imei:000000000000011',
		lifetime: '3600',
		lwm2mv: '1.1',
		biding: 'U',
		localServer: false,
	}

	const register = await registration(device)

	await read(register.socketPort)

	setTimeout(async () => {
		const sendParams = {
			newManufacturer: 'test name',
			cbor: true,
			test: false,
		}
		await send(sendParams)
	}, 10 * 1000)
}

await main()
