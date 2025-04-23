/**
 * i increase, d decrease, names please is init
 * 
 * increase inventory for distributors
 */
function choose (arr: Array[], maxi: number, curr: number) {
    // given a list of makers/suppliers, choose one that has the fewest current orders.
    // can I also ensure that they rotate nicely??
    curr += 1
    if (curr >= maxi) {
        curr = 0
    }
    arr[curr][1] += 1
return "" + arr[curr][0] + "I"
}
input.onButtonPressed(Button.A, function () {
    radio.sendValue("names please", 0)
    basic.showIcon(IconNames.Heart)
})
// ## finds the index of a serial number
function find (arr: any[], serial2: number) {
    for (let i = 0; i <= arr.length - 1; i++) {
        if (arr[i][0] == serial2) {
            return i
        }
    }
    return -1
}
input.onButtonPressed(Button.AB, function () {
    _type = 0
})
input.onButtonPressed(Button.B, function () {
    basic.showIcon(IconNames.Sad)
    for (let n of manufactlist) {
        radio.sendValue("" + n[0] + "S", 1)
    }
    for (let m of supplylist) {
        radio.sendValue("" + m[0] + "S", 1)
    }
})
// if name.includes(convert_to_text(control.device_serial_number())):
// basic.show_string("" + str(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)))
radio.onReceivedValue(function (name, value) {
    let loc: number;
// ##### adding the players to lists
    if (name == "name") {
        if (value == 1) {
            count[0] += 1
supplylist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 1])
            radio.sendValue("" + supplylist[-1][0] + "I", supplylist[-1][1])
        }
        // add list
        if (value == 2) {
            count[1] += 1
manufactlist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 1])
            radio.sendValue("" + manufactlist[-1][0] + "I", manufactlist[-1][1])
        }
        if (value == 3) {
            count[2] += 1
consumelist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 4])
            radio.sendValue("" + consumelist[-1][0] + "I", consumelist[-1][1])
        }
    }
    // #### End player init
    // if consumer demands
    if (name == "consumer") {
        if (inventory > 0) {
            inventory += 0 - value
            // update inventory, then tell that consumer that they were successful
            radio.sendValue("" + radio.receivedPacket(RadioPacketProperty.SerialNumber) + "D", value)
            loc = find(consumelist, radio.receivedPacket(RadioPacketProperty.SerialNumber))
            // find consumer in list
            if (loc != -1) {
                consumelist[loc][1] -= 1
            }
        } else {
            demand = true
        }
    }
    // indicate more demand needed
    // ###suppliers
    if (name == "supplier") {
        loc = find(supplylist, radio.receivedPacket(RadioPacketProperty.SerialNumber))
        if (loc != -1) {
            supplylist[loc][1] -= 1
        }
        // # decrement a supplier total and send to maker
        radio.sendValue(choose(manufactlist, count[1], current[1]), 1)
    }
    if (name == "maker") {
        loc = find(manufactlist, radio.receivedPacket(RadioPacketProperty.SerialNumber))
        if (loc != -1) {
            manufactlist[loc][1] -= 1
        }
        inventory += 5
    }
})
let timenow = 0
let demand = false
let curr = 0
let _type = 0
let inventory = 0
let current: number[] = []
let count: number[] = []
let consumelist : number[][] = []
let manufactlist : number[][] = []
let supplylist : number[][] = []
// ############
let slow = false
count = [0, 0, 0]
// #suppliers, makers, consumers
current = [0, 0, 0]
supplylist = [[0, 0]]
manufactlist = [[0, 0]]
consumelist = [[0, 0]]
_py.py_array_pop(supplylist)
_py.py_array_pop(manufactlist)
_py.py_array_pop(consumelist)
// ## Starting inventory number
inventory = 32
let dtime = control.millis()
let stime = control.millis()
_type = "distributor"
radio.setGroup(1)
radio.setTransmitSerialNumber(true)
radio.sendString("" + (_type))
basic.forever(function () {
    let started = 0
    let val: number;
timenow = control.millis()
    if (started) {
        // send out additional demand every 4-9 seconds, random 1-2 each
        if (timenow - dtime > 5000) {
            for (let x of consumelist) {
                val = randint(1, 2)
                radio.sendValue("" + x[0] + "I", val)
                x[1] += val
            }
        }
        // if inventory drops, ping a supplier to make more stuff.
        if (inventory < 10 && timenow - stime > 3000) {
            radio.sendValue("" + choose(supplylist, count[0], current[0]) + "I", 1)
        }
    }
})
