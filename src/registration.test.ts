import { Server, createServer } from 'coap'
import { registration } from './registration'

describe('registerDeviceObjects', () => {
	let server: Server

	beforeEach(async () => {
		server = createServer()
		server.listen(5683)
	})

	it('should register device object', async () => {
		let expectedPort = 0
		const result = new Promise<{ socketPort: number }>((resolve) => {
			// receive client handshake
			server.on('request', (req, res) => {
				res.end()
				expectedPort = req.rsinfo.port
				resolve({ socketPort: req.rsinfo.port })
			})
		})

		const params = {
			deviceName: 'urn:imei:000000000000005',
			lifetime: '3600',
			lwm2mv: '1.1',
			biding: 'U',
			localServer: true,
		}
		await registration(params)

		expect((await result).socketPort).toBe(expectedPort)
	})
})
