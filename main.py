def on_button_pressed_a():
    radio.send_value("names please", 0)
input.on_button_pressed(Button.A, on_button_pressed_a)

# i increase, d decrease, names please is init

def on_received_value(name, value):
    if name == "consumer":
        pass
        #add to consumer list
    if name.includes(convert_to_text(control.device_serial_number())):
        basic.show_string("" + str((radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))))
radio.on_received_value(on_received_value)

slow = False
_type = "distributor"
radio.set_group(1)
radio.set_transmit_serial_number(True)
radio.send_string(_type)

def on_forever():
    if input.button_is_pressed(Button.A):
        basic.show_icon(IconNames.GHOST)
        basic.pause(randint(3000, 8000))
        radio.send_value(_type, 1)
        basic.show_icon(IconNames.YES)
        basic.pause(1000)
    basic.show_number(7)
basic.forever(on_forever)
