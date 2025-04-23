def on_button_pressed_a():
    radio.send_value("names please", 0)
    basic.show_icon(IconNames.HEART)
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    basic.show_icon(IconNames.SAD)
    for n in manufactlist:
        radio.send_value(n[0]+"S", 1)
    for m in supplylist:
        radio.send_value(m[0]+"S", 1)
input.on_button_pressed(Button.B, on_button_pressed_b)
# i increase, d decrease, names please is init

def on_received_value(name, value):
    global inventory, demand, manufactlist, supplylist, consumelist, current, count
    # ##### adding the players to lists
    if name == "name":
        if value == 1:
            # suppliers
            count[0] += 1
            supplylist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 1])
            radio.send_value("" + str(supplylist[-1][0]) + "I", supplylist[-1][1])
        # add list
        if value == 2:
            # manufacturers
            count[1] += 1
            manufactlist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 1])
            radio.send_value("" + str(manufactlist[-1][0]) + "I", manufactlist[-1][1])
        if value == 3:
            # consumers
            count[2] += 1
            consumelist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 4])
            radio.send_value("" + str(consumelist[-1][0]) + "I", consumelist[-1][1])
    # #### End player init

    # if consumer demands
    if name == "consumer":
        if inventory > 0:  
            inventory += 0 - value  #update inventory, then tell that consumer that they were successful 
            radio.send_value("" + str(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)) + "D", value)
            loc = find(consumelist , radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)) #find consumer in list
            if loc != -1:  #catch any errors 
                consumelist[loc][1] -= 1
        else:
            demand = True
    # indicate more demand needed

    # ###suppliers
    if name == "supplier":
        loc = find(supplylist , radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
        if loc != -1:
            supplylist[loc][1] -= 1
        # # decrement a supplier total and send to maker
        radio.send_value(choose(manufactlist, count[1], current[1]), 1)
    if name == "maker":
        loc = find(manufactlist , radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
        if loc != -1:
            manufactlist[loc][1] -= 1
        inventory += 5  #increase inventory for distributors
'''
    if name.includes(convert_to_text(control.device_serial_number())):
        basic.show_string("" + str(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)))'''
radio.on_received_value(on_received_value)

inventory = 0
# ############
slow = False
started = False
count = [0,0,0]   ##suppliers, makers, consumers
current = [0, 0, 0]
demand = False
supplylist: List[List[number]] = []
manufactlist: List[List[number]] = []
consumelist: List[List[number]] = []
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
radio.send_string(_type)


### finds the index of a serial number
def find(arr: List[List[number]] , serial: int):
    for i in range(len(arr)):
        if arr[i][0] == serial:
            return i
    return -1

def choose(arr: List[List[number]], maxi, curr ):
    '''
    given a list of makers/suppliers, choose one that has the fewest current orders.
    can I also ensure that they rotate nicely??
    '''
    curr += 1
    if curr >= maxi:
        curr = 0
    arr[curr][1] += 1
    return arr[curr][0] + "I"

def on_forever():
    timenow = control.millis()
    global stime, dtime, consumelist, started
    if started:
        #send out additional demand every 4-9 seconds, random 1-2 each
        if timenow - dtime > 5000:
            for x in consumelist:
                val = randint(1,2)
                radio.send_value(x[0]+'I', val)
                x[1] += val
        #if inventory drops, ping a supplier to make more stuff.
        if inventory < 10 and ((timenow - stime) > 3000):
            radio.send_value(choose(supplylist, count[0], current[0])+'I', 1)

basic.forever(on_forever)
