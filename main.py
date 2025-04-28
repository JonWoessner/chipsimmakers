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
disp = "needed"
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
    while True:
        # display update section
        if disp == "try":
            basic.show_icon(IconNames.TARGET)
            disp = "needed"
        if disp == "success":
            basic.show_icon(IconNames.YES)
            disp = "needed"
        if disp == "needed":
            basic.show_number(demand)
        disp = ""
        basic.pause(2)
control.in_background(onIn_background)