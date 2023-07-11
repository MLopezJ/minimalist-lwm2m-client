import {
	Device_3_urn
} from '@nordicsemiconductor/lwm2m-types'
import { Server, createServer } from 'coap'
import { deviceObjects, type device } from './deviceObjects'
import { send } from './send'

describe('update', () => {
	let server: Server
	let objectsList: device
	let request: Promise<{ payload: string }>

	beforeEach(async () => {
		server = createServer()
		server.listen(5683)
		objectsList = deviceObjects
		request = new Promise<{ payload: string }>((resolve) => {
			server.on('request', (req, res) => {
				res.end()
				resolve({ payload: req.payload.toString() })
			})
		})
	})

	it('should update a string resource using Send operation from Information Reporting interface', async () => {
		const input = {
            newManufacturer: 'test name',
            cbor: false,
            test: true
        }

		const expectedPayload = [{ n: '/3/0/0', vs: 'test name' }]

        await send(input)
		
		const req = await request

		expect(JSON.parse(req.payload)).toStrictEqual(expectedPayload)
		//expect(newResourceValue).toBe(inputValue)
	})
})
