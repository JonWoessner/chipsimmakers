radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    serial.writeLine(name)
    serial.writeLine("" + value)
    serial.writeLine("" + control.deviceSerialNumber())
    if (name == "go") {
        basic.showIcon(IconNames.Yes)
    }
    
    if (name == "init") {
        basic.pause(randint(100, 3000))
        radio.sendValue("name", 3)
        basic.showIcon(IconNames.Heart)
    }
    
    if (value == control.deviceSerialNumber()) {
        if (name == "I") {
            bought += 1
        }
        
    }
    
})
let disp = ""
disp = "total"
let demand = 0
let bought = 0
radio.setGroup(1)
radio.setTransmitSerialNumber(true)
basic.forever(function on_forever() {
    
    if (input.buttonIsPressed(Button.A)) {
        disp = "try"
        //  send radio request
        radio.sendValue("consumer", 1)
        while (input.buttonIsPressed(Button.A)) {
            basic.pause(2)
        }
    }
    
})
control.inBackground(function onIn_background() {
    
    let lastbought = 0
    while (true) {
        //  display update section
        if (disp == "try") {
            basic.showIcon(IconNames.Target)
            basic.showNumber(bought)
            disp = "total"
        }
        
        if (disp == "total") {
            if (bought > lastbought) {
                basic.showNumber(bought)
                lastbought = bought
            }
            
        }
        
        basic.pause(2)
    }
})
