def on_button_pressed_a():
    radio.send_value("init", 0)
    basic.show_icon(IconNames.HEART)
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    global slow
    if slow == False:
        slow = True
        basic.show_icon(IconNames.SAD)
        for n in manufactlist:
            radio.send_value("S", n[0])
            serial.write_line(''+ n[0])
        for m in supplylist:
            radio.send_value("S", m[0])
    else:
        slow = False
        basic.show_icon(IconNames.HAPPY)
        for o in manufactlist:
            radio.send_value("F", o[0])
        for p in supplylist:
            radio.send_value("F", p[0])
input.on_button_pressed(Button.B, on_button_pressed_b)
# i increase, d decrease, names please is init

def on_button_pressed_ab():
    global started
    basic.show_icon(IconNames.YES)
    #serial.write_line(supplylist[0][0]+'')
    ##START THE GAME##
    if not started:
        started = True
        # send initial values
        for i in manufactlist:
            radio.send_value('I', i[0])
        for j in supplylist:
            radio.send_value('I', j[0])
        basic.show_number(inventory)
        radio.send_value("go", 0)
    
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_received_value(name, value):
    serial.write_line("hey there")
    serial.write_line(''+started+'')
    global inventory, demand, manufactlist, supplylist, consumelist, current, count
    # ##### adding the players to lists
    if name.includes('name'):
        if value == 1:
            # suppliers
            count[0] += 1
            serial.write_line("added "+ radio.received_packet(RadioPacketProperty.SERIAL_NUMBER) +" to the supplylist")
            supplylist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 1])
            ########radio.send_value("I", supplylist[len(supplylist)-1][0]) 
        if value == 2:
            # manufacturers
            count[1] += 1
            manufactlist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 1])
        if value == 3:
            # consumers
            count[2] += 1
            consumelist.append([radio.received_packet(RadioPacketProperty.SERIAL_NUMBER), 0])
    # #### End player init
    if started:
        # if consumer demands
        serial.write_line(name + ' '+ value)
        if name == "consumer":
            if inventory > 0:  
                inventory -= 1  #update inventory, then tell that consumer that they were successful 
                radio.send_value('I', radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
                #basic.show_icon(IconNames.NO)  #debug
                loc = find(consumelist , radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)) #find consumer in list
                if loc != -1:  #catch any errors 
                    consumelist[loc][1] += 1
            else:
                demand = True
        # indicate more demand needed

        # ###suppliers
        if name == "supplier":
            loc = find(supplylist , radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
            if loc != -1:
                supplylist[loc][1] -= 1
            # # decrement a supplier total and send to maker
            radio.send_value('I', choose(manufactlist, 1))
        if name == "manufact":
            loc = find(manufactlist , radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
            if loc != -1:
                manufactlist[loc][1] -= 1
            #serial.write_line("inventory pre: "+ inventory)
            inventory += 5  #increase inventory for distributors
            #serial.write_line("inventory post: "+ inventory)
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
inventory = 12
dtime = control.millis()
stime = control.millis()
_type = "distributor"
radio.set_group(1)
radio.set_transmit_serial_number(True)



### finds the index of a serial number
def find(arr: List[List[number]] , serial: int):
    for i in range(len(arr)):
        if arr[i][0] == serial:
            return i
    return -1

def choose(arr: List[List[number]], kind):
    '''
    given a list of makers/suppliers, choose one that has the fewest current orders.
    can I also ensure that they rotate nicely??
    instead, we will simply rotate through them all in turn
    we could also implement a TSMC mode, where the first manufacturer gets extra orders? 
    '''
    current[kind] += 1
    if current[kind] >= len(arr):
        current[kind] = 0
    arr[current[kind]][1] += 1
    serial.write_line('attempting to send I to: '+arr[current[kind]][0])
    return arr[current[kind]][0]

def on_forever():
    timenow = control.millis()
    global stime, dtime, consumelist, started
    if started:
        '''   removing the add-demand, consumers will have a goal on paper
        #send out additional demand every 4-9 seconds, random 1-2 each
        if timenow - dtime > 5000:
            for x in consumelist:
                val = randint(1,2)
                radio.send_value(x[0]+'I', val)
                x[1] += val'''
        #if inventory drops, ping a supplier to make more stuff.
        if inventory < 20 and ((timenow - stime) > 3000):
            basic.show_icon(IconNames.NO)
            stime = timenow
            radio.send_value('I', choose(supplylist, 0))
        if inventory < 8 and ((timenow - stime) > 1500):  #if inventory really low, send more demand faster
            basic.show_icon(IconNames.NO)
            stime = timenow
            radio.send_value('I', choose(supplylist, 0))
            radio.send_value('I', choose(supplylist, 0))
    basic.pause(5)
basic.forever(on_forever)

def onIn_background():
    while True:
        #basic.show_number(inventory)
        serial.write_line("inventory: "+ inventory)
        basic.pause(100)
control.in_background(onIn_background)