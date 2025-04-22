input.onButtonPressed(Button.A, function on_button_pressed_a() {
    radio.sendValue("names please", 0)
})
//  i increase, d decrease, names please is init
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    if (name == "name") {
        if (value == 1) {
            // suppliers
            supplylist.push( {
                "name" : radio.receivedPacket(RadioPacketProperty.SerialNumber),
                "total" : 1,
            }
            )
            radio.sendValue("" + supplylist[-1]["names"] + "I", supplylist[-1]["total"])
        }
        
        // add list
        if (value == 2) {
            // manufacturers
            
        }
        
        if (value == 3) {
            // consumers
            
        }
        
    }
    
    if (name.includes(convertToText(control.deviceSerialNumber()))) {
        basic.showString("" + ("" + radio.receivedPacket(RadioPacketProperty.SerialNumber)))
    }
    
})
let supplylist = [ {
	
}
]
let manufactlist = [ {
	
}
]
let consumelist = [ {
	
}
]
_py.py_array_pop(supplylist)
_py.py_array_pop(manufactlist)
_py.py_array_pop(consumelist)
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
