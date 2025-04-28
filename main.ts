radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
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
        if (name == "I") {
            demand += 1
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
let _type = "supplier"
// # supplier or manufacturer
let numtype = 1
slow = false
let demand = 0
let lastdemand = 0
radio.setGroup(1)
radio.setTransmitSerialNumber(true)
basic.forever(function on_forever() {
    let lastdemand: number;
    
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
        
        // basic.pause(1000)
        while (input.buttonIsPressed(Button.A)) {
            basic.pause(2)
        }
    }
    
    if (demand > lastdemand) {
        basic.showNumber(demand)
        lastdemand = demand
    }
    
    basic.pause(2)
})
