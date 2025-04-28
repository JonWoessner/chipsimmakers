def on_received_value(name, value):
    global demand, disp, bought
    if name == "init":
        basic.pause(randint(100, 3000))
        radio.send_value("name", 3)
    if value == control.device_serial_number():
        if name == 'I':
            bought += 1
radio.on_received_value(on_received_value)

disp = ""
disp = "total"
demand = 0
bought = 0
radio.set_group(1)
radio.set_transmit_serial_number(True)

def on_forever():
    global disp
    if input.button_is_pressed(Button.A):
        disp = "try"
        # send radio request
        radio.send_value('consumer', 1)
    
basic.forever(on_forever)


def onIn_background():
    global disp
    lastbought = 0
    while True:
        # display update section
        if disp == "try":
            basic.show_icon(IconNames.TARGET)
            basic.show_number(bought)
            disp = "total"
        if disp == "total":
            if bought > lastbought:
                basic.show_number(bought)
                lastbought = bought
        basic.pause(2)
control.in_background(onIn_background)