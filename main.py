def on_button_pressed_a():
    radio.send_value("names please", 0)
    basic.show_icon(IconNames.HEART)
input.on_button_pressed(Button.A, on_button_pressed_a)

# i increase, d decrease, names please is init

def on_received_value(name, value):
    global inventory
    # ##### adding the players to lists
    if name == "name":
        if value == 1:
            # suppliers
            supplylist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 1])
            radio.send_value("" + str(supplylist[-1][0]) + "I", supplylist[-1][1])
        # add list
        if value == 2:
            # manufacturers
            manufactlist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 1])
            radio.send_value("" + str(manufactlist[-1][0]) + "I", manufactlist[-1][1])
        if value == 3:
            # consumers
            manufactlist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 4])
            radio.send_value("" + str(manufactlist[-1][0]) + "I", manufactlist[-1][1])
    # #### End player init
    # if consumer demands
    if name == "consumer":
        # # how do I update the value in the consumelist??????
        if inventory > 0:
            inventory += 0 - value
            radio.send_value("" + str(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)) + "D",
                value)
        else:
            pass
    # indicate more demand needed

    ####suppliers
    if name == 'supplier':
        pass  ## decrement a supplier total and send to maker
        

    if name == 'maker':
        pass

    if name.includes(convert_to_text(control.device_serial_number())):
        basic.show_string("" + str(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)))
radio.on_received_value(on_received_value)

inventory = 0
manufactlist: List[List[number]] = []
supplylist: List[List[number]] = []
# ############
slow = False
supplylist = [[0, 0]]
manufactlist = [[0, 0]]
consumelist = [[0, 0]]
supplylist.pop()
manufactlist.pop()
consumelist.pop()
# ## Starting inventory number
inventory = 32
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


def find(arr, name):
    #for i in range(len(arr)):
        pass