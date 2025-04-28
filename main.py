def on_received_value(name, value):
    global demand, slow, _type
    if name == "go":
        basic.show_icon(IconNames.YES)
        basic.show_number(demand)
    if name == "init":
        basic.pause(randint(100, 3000))
        radio.send_value("name", numtype)  ### 1 for suppliers, 2 for manufacutres
        basic.show_icon(IconNames.HEART)
    if value == control.device_serial_number():
        if name == 'I':
            demand += 1
        if name == "S":
            slow = True
        if name == "F":
            slow = False

radio.on_received_value(on_received_value)

slow = False
_type = "supplier"  ## supplier or manufacturer
numtype = 1
slow = False
demand = 0
lastdemand = 0
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
        while input.button_is_pressed(Button.A):
            basic.pause(2)
    if demand > lastdemand:
        basic.show_number(demand)
        lastdemand = demand
    basic.pause(2)
basic.forever(on_forever)
