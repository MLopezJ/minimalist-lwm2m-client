import cbor from 'cbor'

describe("cbor", () => {
    it("should check if cbor lib is creating payload as expected", () => {
        /**
         * Page 86 of https://www.openmobilealliance.org/release/LightweightM2M/V1_1_1-20190617-A/OMA-TS-LightweightM2M_Core-V1_1_1-20190617-A.pdf
         * shows an example of a transformation from CBOR to SenML CBOR diagnostic notation
         * 
         * It is used as a reference to check if CBOR lib is creating payload as expected
         */


         /**
         * SenML CBOR diagnostic notation
         * 
         * [
         *  {"bn":"/3/0/","n":"0","vs":"Open Mobile Alliance"}, 
         *  {"n":"1","vs":"Lightweight M2M Client"},
         *  {"n":"2","vs":"345000123"}, 
         *  {"n":"3","vs":"1.0"}, 
         *  {"n":"6/0","v":1}, 
         *  {"n":"6/1","v":5}, 
         *  {"n":"7/0","v":3800}, 
         *  {"n":"7/1","v":5000}, 
         *  {"n":"8/0","v":125},
         *  {"n":"8/1","v":900},
         *  {"n":"9","v":100},
         *  {"n":"10","v":15},
         *  {"n":"11/0","v":0},
         *  {"n":"13","v":1367491215},
         *  {"n":"14","vs":"+02:00"},
         *  {"n":"16","vs":"U"}
         * ]
         */

        // Device
        // {"bn":"/3/0/","n":"0","vs":"Open Mobile Alliance"}, 
        const manufacturer = new Map()
            .set(-2, '/3/0/')
            .set(0, '0')
            .set(3, "Open Mobile Alliance")

        // {"n":"1","vs":"Lightweight M2M Client"},
        const model =  new Map()
        .set(0, '1')
        .set(3, "Lightweight M2M Client")

        // {"n":"2","vs":"345000123"}, 
        const serial = new Map()
        .set(0, '2')
        .set(3, "345000123")

        // {"n":"3","vs":"1.0"}, 
        const firmareVersion = new Map()
        .set(0, '3')
        .set(3, "1.0")

        // Location
        // {"n":"6/0","v":1},
        const latitude = new Map()
        .set(0, '6/0')
        .set(2, 1)

        // {"n":"6/1","v":5}, 
        const longitude = new Map()
        .set(0, '6/1')
        .set(2, 5)

        // Conectivity Statistics
        // {"n":"7/0","v":3800}, 
        const SMSTxCounter = new Map()
        .set(0, '7/0')
        .set(2, 3800)

        // {"n":"7/1","v":5000}, 
        const SMSRxCounter = new Map()
        .set(0, '7/1')
        .set(2, 5000)

        // LockandWipe 
        // {"n":"8/0","v":125},
        const state = new Map()
        .set(0, '8/0')
        .set(2, 125)

        // {"n":"8/1","v":900},
        const locktarget = new Map()
        .set(0, '8/1')
        .set(2, 900)


        // {"n":"9","v":100},
        const nine = new Map()
        .set(0, '9')
        .set(2, 100)

        // {"n":"10","v":15},
        const ten = new Map()
        .set(0, '10')
        .set(2, 15)

        // LWM2M APN Connection Profile
        // {"n":"11/0","v":0},
        const profileName = new Map()
        .set(0, '11/10')
        .set(2, 0)

        // {"n":"13","v":1367491215},
        const thirteen = new Map()
        .set(0, '13')
        .set(2, 1367491215)

        // {"n":"14","vs":"+02:00"},
        const fourteen = new Map()
        .set(0, '14')
        .set(3,  "+02:00")

        // {"n":"16","vs":"U"}
        const sixteen = new Map()
        .set(0, '16')
        .set(3,  "U")

        const cborValue = cbor.encode([
            manufacturer,
            model,
            serial,
            firmareVersion,
            latitude,
            longitude,
            SMSTxCounter,
            SMSRxCounter,
            state,
            locktarget,
            nine,
            ten,
            profileName,
            thirteen,
            fourteen,
            sixteen
        ])

        /**
         "90 a3 21 65 2f 33 2f 30 2f 00 61 30 03 74 4f 70 65 6e 20 4d 6f 62 69 6c 65 20 41 6c 6c 69 61 6e 63 65 a2 00 61 31 03 76 4c 69 67 68 74 77 65 69 67 68 74 20 4d 32 4d 20 43 6c 69 65 6e 74 a2 00 61 32 03 69 33 34 35 30 30 30 31 32 33 a2 00 61 33 03 63 31 2e 30 a2 00 63 36 2f 30 02 01 a2 00 63 36 2f 31 02 05 a2 00 63 37 2f 30 02 19 0e d8 a2 00 63 37 2f 31 02 19 13 88 a2 00 63 38 2f 30 02 18 7d a2 00 63 38 2f 31 02 19 03 84 a2 00 61 39 02 18 64 a2 00 62 31 30 02 0f a2 00 64 31 31 2f 30 02 00 a2 00 62 31 33 02 1a 51 82 42 8f a2 00 62 31 34 03 66 2b 30 32 3a 30 30 a2 00 62 31 36 03 61 55 "
         */
        const cborExpectedResult =  '90a321652f332f302f00613003744f70656e204d6f62696c6520416c6c69616e6365a200613103764c69676874776569676874204d324d20436c69656e74a20061320369333435303030313233a20061330363312e30a20063362f300201a20063362f310205a20063372f3002190ed8a20063372f3102191388a20063382f3002187da20063382f3102190384a2006139021864a200623130020fa2006431312f300200a200623133021a5182428fa20062313403662b30323a3030a200623136036155'

        expect(cborExpectedResult).toBe(cborValue.toString('hex'))


    })
})

/**
 * For the moment, I dont have the warranty that the cbor lib is creating the payload as expected.
 */