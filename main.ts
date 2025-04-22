input.onButtonPressed(Button.A, function on_button_pressed_a() {
    radio.sendValue("names please", 0)
})
//  i increase, d decrease, names please is init
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    if (name == "consumer") {
        
    }
    
    // add to consumer list
    if (name.includes(convertToText(control.deviceSerialNumber()))) {
        basic.showString("" + ("" + radio.receivedPacket(RadioPacketProperty.SerialNumber)))
    }
    
})
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
