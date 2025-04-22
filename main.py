def on_received_value(name, value):
    global demand, disp, slow, _type
    if name == "names please":
        radio.send_string("_type")
    if name.includes(convert_to_text(control.device_serial_number())):
        if "this".char_at(-1) == "I":
            demand += value
            disp = "needed"
        if "this".char_at(-1) == "D":
            demand += 0 - value
            disp = "success"
        if "this".char_at(-1) == "S":
            if slow:
                slow = False
            else:
                slow = True
radio.on_received_value(on_received_value)

slow = False
disp = ""
disp = "needed"
_type = "consumer"
slow = False
demand = 3
radio.set_group(1)
radio.set_transmit_serial_number(True)

def on_forever():
    global disp
    if input.button_is_pressed(Button.A):
        if demand > 0:
            # if slow:
            # basic.show_icon(IconNames.GHOST)
            # basic.pause(randint(3000, 8000))
            # set flag
            disp = "try"
            # send radio request
            radio.send_value(_type, 1)
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
basic.forever(on_forever)
