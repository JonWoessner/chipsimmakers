def on_received_value(name, value):
    global demand, disp, bought
    serial.write_line(name)
    serial.write_line(''+value)
    serial.write_line(""+control.device_serial_number())
    if name == "go":
        basic.show_icon(IconNames.YES)
    if name == "init":
        basic.pause(randint(100, 3000))
        radio.send_value("name", 3)
        basic.show_icon(IconNames.HEART)
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
basic.show_icon(IconNames.STICK_FIGURE)

def on_forever():
    global disp
    if input.button_is_pressed(Button.A):
        disp = "try"
        # send radio request
        radio.send_value('consumer', 1)
        while input.button_is_pressed(Button.A):
            basic.pause(2)
    
basic.forever(on_forever)

def on_button_pressed_b():
    basic.show_number(bought)
input.on_button_pressed(Button.B, on_button_pressed_b)

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