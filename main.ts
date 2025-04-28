input.onButtonPressed(Button.A, function on_button_pressed_a() {
    radio.sendValue("init", 0)
    basic.showIcon(IconNames.Diamond)
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    let slow: boolean;
    if (slow == false) {
        slow = true
        basic.showIcon(IconNames.Sad)
        for (let n of manufactlist) {
            radio.sendValue("S", n[0])
        }
        for (let m of supplylist) {
            radio.sendValue("S", m[0])
        }
    } else {
        slow = false
        basic.showIcon(IconNames.Happy)
        for (let o of manufactlist) {
            radio.sendValue("F", o[0])
        }
        for (let p of supplylist) {
            radio.sendValue("F", p[0])
        }
    }
    
})
//  i increase, d decrease, names please is init
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    let started: boolean;
    basic.showIcon(IconNames.Heart)
    // #START THE GAME##
    if (!started) {
        started = true
        //  send initial values
        for (let i of manufactlist) {
            radio.sendValue("I", i[0])
        }
        for (let j of supplylist) {
            radio.sendValue("I", j[0])
        }
        basic.showNumber(inventory)
    }
    
})
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    let loc: number;
    serial.writeLine(started + "")
    
    //  ##### adding the players to lists
    if (name.includes("name")) {
        if (value == 1) {
            //  suppliers
            count[0] += 1
            supplylist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 1])
        }
        
        // #######radio.send_value("I", supplylist[len(supplylist)-1][0]) 
        if (value == 2) {
            //  manufacturers
            count[1] += 1
            manufactlist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 1])
        }
        
        if (value == 3) {
            //  consumers
            count[2] += 1
            consumelist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 0])
        }
        
    }
    
    //  #### End player init
    if (started) {
        //  if consumer demands
        serial.writeLine(name + " " + value)
        if (name == "consumer") {
            if (inventory > 0) {
                inventory -= 1
                // update inventory, then tell that consumer that they were successful 
                radio.sendValue("I", radio.receivedPacket(RadioPacketProperty.SerialNumber))
                basic.showIcon(IconNames.No)
                loc = find(consumelist, radio.receivedPacket(RadioPacketProperty.SerialNumber))
                // find consumer in list
                if (loc != -1) {
                    // catch any errors 
                    consumelist[loc][1] += 1
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
            radio.sendValue("I", choose(manufactlist, count[1], current[1]))
        }
        
        if (name == "manufacturer") {
            loc = find(manufactlist, radio.receivedPacket(RadioPacketProperty.SerialNumber))
            if (loc != -1) {
                manufactlist[loc][1] -= 1
            }
            
            inventory += 5
        }
        
    }
    
    // increase inventory for distributors
    /** 
    if name.includes(convert_to_text(control.device_serial_number())):
        basic.show_string("" + str(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)))
 */
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

function choose(arr: number[][], maxi: number, curr: number): number {
    /** 
    given a list of makers/suppliers, choose one that has the fewest current orders.
    can I also ensure that they rotate nicely??
    instead, we will simply rotate through them all in turn
    we could also implement a TSMC mode, where the first manufacturer gets extra orders? 
    
 */
    curr += 1
    if (curr >= maxi) {
        curr = 0
    }
    
    arr[curr][1] += 1
    return arr[curr][0]
}

basic.forever(function on_forever() {
    let timenow = control.millis()
    
    if (started) {
        /**    removing the add-demand, consumers will have a goal on paper
        #send out additional demand every 4-9 seconds, random 1-2 each
        if timenow - dtime > 5000:
            for x in consumelist:
                val = randint(1,2)
                radio.send_value(x[0]+'I', val)
                x[1] += val
 */
        // if inventory drops, ping a supplier to make more stuff.
        if (inventory < 10 && timenow - stime > 3000) {
            stime = timenow
            radio.sendValue(choose(supplylist, count[0], current[0]) + "I", 1)
        }
        
    }
    
    basic.pause(5)
})
control.inBackground(function onIn_background() {
    while (true) {
        basic.showNumber(inventory)
        basic.pause(100)
    }
})
