input.onButtonPressed(Button.A, function on_button_pressed_a() {
    radio.sendValue("names please", 0)
    basic.showIcon(IconNames.Heart)
})
//  i increase, d decrease, names please is init
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    // ##### adding the players to lists
    if (name == "name") {
        if (value == 1) {
            // suppliers
            supplylist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 1])
            radio.sendValue(supplylist[-1][0] + "I", supplylist[-1][1])
        }
        
        // add list
        if (value == 2) {
            // manufacturers
            manufactlist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 1])
            radio.sendValue(manufactlist[-1][0] + "I", manufactlist[-1][1])
        }
        
        if (value == 3) {
            // consumers
            manufactlist.push([radio.receivedPacket(RadioPacketProperty.SerialNumber), 4])
            radio.sendValue(manufactlist[-1][0] + "I", manufactlist[-1][1])
        }
        
    }
    
    // #### End player init
    // if consumer demands
    if (name == "consumer") {
        if (inventory > 0) {
            inventory -= value
            radio.sendValue(radio.receivedPacket(RadioPacketProperty.SerialNumber) + "D", value)
        } else {
            // # how do I update the value in the consumelist??????
            
        }
        
    }
    
    // indicate more demand needed
    if (name.includes(convertToText(control.deviceSerialNumber()))) {
        basic.showString("" + ("" + radio.receivedPacket(RadioPacketProperty.SerialNumber)))
    }
    
})
let supplylist = [[0, 0]]
let manufactlist = [[0, 0]]
let consumelist = [[0, 0]]
_py.py_array_pop(supplylist)
_py.py_array_pop(manufactlist)
_py.py_array_pop(consumelist)
// ## Starting inventory number
let inventory = 32
// ############
let slow = false
let _type = "distributor"
radio.setGroup(1)
radio.setTransmitSerialNumber(true)
radio.sendString(_type)
basic.forever(function on_forever() {
    if (input.buttonIsPressed(Button.A)) {
        basic.showIcon(IconNames.Ghost)
        basic.pause(randint(3000, 8000))
        radio.sendValue(_type, 1)
        basic.showIcon(IconNames.Yes)
        basic.pause(1000)
    }
    
    basic.showNumber(7)
})
