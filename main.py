def on_button_pressed_a():
    radio.send_value("names please", 0)
input.on_button_pressed(Button.A, on_button_pressed_a)

# i increase, d decrease, names please is init

def on_received_value(name, value):
    global supplylist, manufactlist, consumelist
    if name == "name":
        if value == 1: #suppliers
            supplylist.push({'name':radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 'total': 1})
            radio.send_value(""+(supplylist[-1]['names'])+"I", supplylist[-1]['total'])
            #add list
        if value == 2:  #manufacturers
            pass
        if value == 3:  #consumers
            pass

    if name.includes(convert_to_text(control.device_serial_number())):
        basic.show_string("" + str((radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))))
radio.on_received_value(on_received_value)

supplylist = [{}]
manufactlist = [{}]
consumelist = [{}]
supplylist.pop()
manufactlist.pop()
consumelist.pop()
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
