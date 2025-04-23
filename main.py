def on_received_value(name, value):
    global demand, slow, _type
    if name == "names please":
        radio.send_value("name", 1)
    if name.includes(convert_to_text(control.device_serial_number())):
        if "this".char_at(-1) == "I":
            demand += value
        if "this".char_at(-1) == "S":
            if slow:
                slow = False
            else:
                slow = True
radio.on_received_value(on_received_value)

slow = False
_type = "supplier"
slow = False
demand = 1
radio.set_group(1)
radio.set_transmit_serial_number(True)

def on_forever():
    global demand
    if input.button_is_pressed(Button.A):
        if demand > 0:
            if slow:
                basic.show_icon(IconNames.GHOST)
                basic.pause(randint(3000, 8000))
            demand += -1
            radio.send_value(_type, 1)
            basic.show_icon(IconNames.YES)
            #basic.pause(1000)
    basic.show_number(demand)
basic.forever(on_forever)
