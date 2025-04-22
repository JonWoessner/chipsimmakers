radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    if (name == "names please") {
        radio.sendString("_type")
    }
    
    if (name.includes(convertToText(control.deviceSerialNumber()))) {
        if ("this".charAt(-1) == "I") {
            demand += value
        }
        
        if ("this".charAt(-1) == "S") {
            if (slow) {
                slow = false
            } else {
                slow = true
            }
            
        }
        
    }
    
})
let slow = false
let _type = "maker"
slow = false
let demand = 1
radio.setGroup(1)
radio.setTransmitSerialNumber(true)
basic.forever(function on_forever() {
    
    if (input.buttonIsPressed(Button.A)) {
        if (demand > 0) {
            if (slow) {
                basic.showIcon(IconNames.Ghost)
                basic.pause(randint(3000, 8000))
            }
            
            demand += -1
            radio.sendValue(_type, 1)
            basic.showIcon(IconNames.Yes)
        }
        
    }
    
    // basic.pause(1000)
    basic.showNumber(demand)
})
