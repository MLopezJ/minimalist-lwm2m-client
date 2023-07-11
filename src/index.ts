import { read } from "./read"
import { registration } from "./registration"
import { send } from "./send"


const main = async () => {

    const device = {
        deviceName: "urn:imei:000000000000005",
        lifetime: "3600",
        lwm2mv: "1.1",
        biding: 'U'
    }

    const register = await registration(device)

    await read(register.socketPort)

    setTimeout(async() => {
        console.log('\nexecuting send operation')
        await send('test name')
    }, 10 * 1000)

}

main()