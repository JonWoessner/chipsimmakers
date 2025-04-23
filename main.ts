input.onButtonPressed(Button.A, function on_button_pressed_a() {
    radio.sendValue("names please", 0)
    basic.showIcon(IconNames.Heart)
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    basic.showIcon(IconNames.Sad)
    for (let n of manufactlist) {
        radio.sendValue(n[0] + "S", 1)
    }
    for (let m of supplylist) {
        radio.sendValue(m[0] + "S", 1)
    }
})
//  i increase, d decrease, names please is init
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    let started = true
})
// increase inventory for distributors
/** 
    if name.includes(convert_to_text(control.device_serial_number())):
        basic.show_string("" + str(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)))
 */
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    let loc: number;
    
    //  ##### adding the players to lists
    if (name == "name") {
        if (value == 1) {
            //  suppliers
            count[0] += 1
            supplylist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 1])
            radio.sendValue("" + ("" + supplylist[-1][0]) + "I", supplylist[-1][1])
        }
        
        //  add list
        if (value == 2) {
            //  manufacturers
            count[1] += 1
            manufactlist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 1])
            radio.sendValue("" + ("" + manufactlist[-1][0]) + "I", manufactlist[-1][1])
        }
        
        if (value == 3) {
            //  consumers
            count[2] += 1
            consumelist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 4])
            radio.sendValue("" + ("" + consumelist[-1][0]) + "I", consumelist[-1][1])
        }
        
    }
    
    //  #### End player init
    //  if consumer demands
    if (name == "consumer") {
        if (inventory > 0) {
            inventory += 0 - value
            // update inventory, then tell that consumer that they were successful 
            radio.sendValue("" + ("" + radio.receivedPacket(RadioPacketProperty.SerialNumber)) + "D", value)
            loc = find(consumelist, radio.receivedPacket(RadioPacketProperty.SerialNumber))
            // find consumer in list
            if (loc != -1) {
                // catch any errors 
                consumelist[loc][1] -= 1
            }
            
        } else {
            demand = true
        }
        
    }
    
    //  indicate more demand needed
    //  ###suppliers
    if (name == "supplier") {
        loc = find(supplylist, radio.receivedPacket(RadioPacketProperty.SerialNumber))
        if (loc != -1) {
            supplylist[loc][1] -= 1
        }
        
        //  # decrement a supplier total and send to maker
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
let inventory = 0
//  ############
let slow = false
let started = false
let count = [0, 0, 0]
// #suppliers, makers, consumers
let current = [0, 0, 0]
let demand = false
let supplylist : number[][] = []
let manufactlist : number[][] = []
let consumelist : number[][] = []
supplylist = [[0, 0]]
manufactlist = [[0, 0]]
consumelist = [[0, 0]]
_py.py_array_pop(supplylist)
_py.py_array_pop(manufactlist)
_py.py_array_pop(consumelist)
//  ## Starting inventory number
inventory = 32
let dtime = control.millis()
let stime = control.millis()
let _type = "distributor"
radio.setGroup(1)
radio.setTransmitSerialNumber(true)
// ## finds the index of a serial number
function find(arr: number[][], serial: number): number {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] == serial) {
            return i
        }
        
    }
    return -1
}

function choose(arr: number[][], maxi: number, curr: number): string {
    /** 
    given a list of makers/suppliers, choose one that has the fewest current orders.
    can I also ensure that they rotate nicely??
    
 */
    curr += 1
    if (curr >= maxi) {
        curr = 0
    }
    
    arr[curr][1] += 1
    return arr[curr][0] + "I"
}

basic.forever(function on_forever() {
    let val: number;
    let timenow = control.millis()
    
    if (started) {
        // send out additional demand every 4-9 seconds, random 1-2 each
        if (timenow - dtime > 5000) {
            for (let x of consumelist) {
                val = randint(1, 2)
                radio.sendValue(x[0] + "I", val)
                x[1] += val
            }
        }
        
        // if inventory drops, ping a supplier to make more stuff.
        if (inventory < 10 && timenow - stime > 3000) {
            radio.sendValue(choose(supplylist, count[0], current[0]) + "I", 1)
        }
        
    }
    
})
