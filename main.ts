radio.onReceivedValue(function on_received_value(name: string, value: number) {
    serial.writeLine("received: " + name + " and " + value)
    
    if (name == "go") {
        basic.showIcon(IconNames.Yes)
        basic.showNumber(demand)
    }
    
    if (name == "init") {
        basic.pause(randint(100, 3000))
        radio.sendValue("name", numtype)
        // ## 1 for suppliers, 2 for manufacutres
        basic.showIcon(IconNames.Heart)
    }
    
    if (value == control.deviceSerialNumber()) {
        serial.writeLine("serial matches!")
        if (name == "I") {
            serial.writeLine("increasing demand")
            demand += 1
            basic.showNumber(demand)
        }
        
        if (name == "S") {
            slow = true
        }
        
        if (name == "F") {
            slow = false
        }
        
    }
    
})
let slow = false
let _type = "manufact"
// # supplier or manufact
let numtype = 2
slow = false
let demand = 0
let lastdemand = 0
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
            basic.showNumber(demand)
        }
        
        // basic.pause(1000)
        while (input.buttonIsPressed(Button.A)) {
            basic.pause(2)
        }
    }
    
    basic.pause(2)
})
