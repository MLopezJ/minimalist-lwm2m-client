import { Server, createServer} from 'coap'
import { deviceObjects, type device } from './deviceObjects'
import { registration, type registrationParams } from './registration'

describe('registerDeviceObjects', () => {
	let server: Server
	let objectsList: device

	beforeEach(async () => {
		objectsList = deviceObjects
		server = createServer()
		server.listen(5683)
	})

	it('should register device object', async () => {
		
		const result = new Promise<{ socketPort: number }>(
			(resolve) => {
				// receive client handshake
				server.on('request', (req, res) => {
					res.end()
					resolve({ socketPort: req.rsinfo.port })
				})
			},
		)

		const params: registrationParams = {
			deviceName: 'urn:imei:000000000000005',
			lifetime: '3600',
			lwm2mv: '1.1',
			biding: 'U',
            test: true
		}
		await registration(params)
    
		const expected = {
			bn: '/3/0',
			e: [
				{ n: '0', sv: 'Nordic', t: 1 }, 
				{ n: '1', sv: '00010' }, 
				{ n: '2', sv: '00000' }, 
				{ n: '3', sv: '0.0' }, 
				{ n: '6', v: 1 }, 
				{ n: '7', v: 0 }, 
				{ n: '9', v: 80 }, 
				{ n: '11', v: 0 }, 
				{ n: '16', sv: 'U' }, 
				{ n: '18', sv: '0.0' }, 
				{ n: '19', sv: '0.0' }, 
			],
		}

		expect((await result).socketPort).toBeGreaterThan(0)
	})
})
