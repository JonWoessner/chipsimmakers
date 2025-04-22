radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    if (name.includes(convertToText(control.deviceSerialNumber()))) {
        if ("this".charAt(-1) == "I") {
            demand += value
            disp = "needed"
        }
        
        if ("this".charAt(-1) == "D") {
            demand += 0 - value
            disp = "success"
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
let disp = ""
disp = "needed"
let _type = "consumer"
slow = false
let demand = 3
radio.setGroup(1)
radio.setTransmitSerialNumber(true)
radio.sendString(_type)
basic.forever(function on_forever() {
    
    if (input.buttonIsPressed(Button.A)) {
        if (demand > 0) {
            //  if slow:
            //  basic.show_icon(IconNames.GHOST)
            //  basic.pause(randint(3000, 8000))
            //  set flag
            disp = "try"
            //  send radio request
            radio.sendValue(_type, 1)
        }
        
    }
    
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
})
