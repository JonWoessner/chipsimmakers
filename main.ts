radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    if (name == "init") {
        basic.pause(randint(100, 3000))
        radio.sendValue("name", 3)
    }
    
    if (value == control.deviceSerialNumber()) {
        if (name == "I") {
            bought += 1
        }
        
    }
    
})
let disp = ""
disp = "needed"
let demand = 0
let bought = 0
radio.setGroup(1)
radio.setTransmitSerialNumber(true)
basic.forever(function on_forever() {
    
    if (input.buttonIsPressed(Button.A)) {
        disp = "try"
        //  send radio request
        radio.sendValue("consumer", 1)
    }
    
})
control.inBackground(function onIn_background() {
    
    while (true) {
        //  display update section
        if (disp == "try") {
            basic.showIcon(IconNames.Target)
            disp = "needed"
        }
        
        if (disp == "success") {
            basic.showIcon(IconNames.Yes)
            disp = "needed"
        }
        
        if (disp == "needed") {
            basic.showNumber(demand)
        }
        
        disp = ""
        basic.pause(2)
    }
})
