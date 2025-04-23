"""

i increase, d decrease, names please is init

increase inventory for distributors

"""
def choose(arr: List[Array], maxi: number, curr: number):
    # given a list of makers/suppliers, choose one that has the fewest current orders.
    # can I also ensure that they rotate nicely??
    curr += 1
    if curr >= maxi:
        curr = 0
    arr[curr][1] += 1
    return "" + str(arr[curr][0]) + "I"

def on_button_pressed_a():
    radio.send_value("names please", 0)
    basic.show_icon(IconNames.HEART)
input.on_button_pressed(Button.A, on_button_pressed_a)

# ## finds the index of a serial number
def find(arr2: List[any], serial2: number):
    i = 0
    while i <= len(arr2) - 1:
        if arr2[i][0] == serial2:
            return i
        i += 1
    return -1

def on_button_pressed_ab():
    global started
    started = True
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    basic.show_icon(IconNames.SAD)
    for n in manufactlist:
        radio.send_value("" + str(n[0]) + "S", 1)
    for m in supplylist:
        radio.send_value("" + str(m[0]) + "S", 1)
input.on_button_pressed(Button.B, on_button_pressed_b)

# if name.includes(convert_to_text(control.device_serial_number())):
# basic.show_string("" + str(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)))

def on_received_value(name, value):
    global inventory, demand
    # ##### adding the players to lists
    if name == "name":
        if value == 1:
            count[0] += 1
            supplylist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 1])
            radio.send_value("" + str(supplylist[-1][0]) + "I", supplylist[-1][1])
        # add list
        if value == 2:
            count[1] += 1
            manufactlist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 1])
            radio.send_value("" + str(manufactlist[-1][0]) + "I", manufactlist[-1][1])
        if value == 3:
            count[2] += 1
            consumelist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 4])
            radio.send_value("" + str(consumelist[-1][0]) + "I", consumelist[-1][1])
    # #### End player init
    # if consumer demands
    if name == "consumer":
        if inventory > 0:
            inventory += 0 - value
            # update inventory, then tell that consumer that they were successful
            radio.send_value("" + str(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)) + "D",
                value)
            loc = find(consumelist,
                radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
            # find consumer in list
            if loc != -1:
                consumelist[loc][1] -= 1
        else:
            demand = True
    # indicate more demand needed
    # ###suppliers
    if name == "supplier":
        loc = find(supplylist,
            radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
        if loc != -1:
            supplylist[loc][1] -= 1
        # # decrement a supplier total and send to maker
        radio.send_value(choose(manufactlist, count[1], current[1]), 1)
    if name == "maker":
        loc = find(manufactlist,
            radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
        if loc != -1:
            manufactlist[loc][1] -= 1
        inventory += 5
radio.on_received_value(on_received_value)

timenow = 0
demand = False
started = False
curr2 = 0
_type = 0
inventory = 0
current: List[number] = []
count: List[number] = []
consumelist: List[List[number]] = []
manufactlist: List[List[number]] = []
supplylist: List[List[number]] = []
# ############
slow = False
count = [0, 0, 0]
# #suppliers, makers, consumers
current = [0, 0, 0]
supplylist = [[0, 0]]
manufactlist = [[0, 0]]
consumelist = [[0, 0]]
supplylist.pop()
manufactlist.pop()
consumelist.pop()
# ## Starting inventory number
inventory = 32
dtime = control.millis()
stime = control.millis()
_type = "distributor"
radio.set_group(1)
radio.set_transmit_serial_number(True)
radio.send_string("" + str((_type)))

def on_forever():
    global timenow, dtime, stime
    timenow = control.millis()
    if started:
        # send out additional demand every 4-9 seconds, random 1-2 each
        if timenow - dtime > 5000:
            dtime = timenow
            for x in consumelist:
                val = randint(1, 2)
                radio.send_value("" + str(x[0]) + "I", val)
                x[1] += val
        # if inventory drops, ping a supplier to make more stuff.
        if inventory < 10 and timenow - stime > 3000:
            stime = timenow
            radio.send_value("" + choose(supplylist, count[0], current[0]) + "I", 1)
basic.forever(on_forever)
