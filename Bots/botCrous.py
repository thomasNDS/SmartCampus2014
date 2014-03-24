#! /usr/bin/python2.7
# -*-coding:Utf-8 -*
# pip install paho-mqtt
#
#  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
# License MIT

import httplib
from BeautifulSoup import BeautifulSoup
import json
import paho.mqtt.client as paho
import os
import time

broker = "localhost"
port = 1883
ids= [17,3,4,24,46,18,19]               # Identifiants des salles sur le site du crous

print "start"

# Create a MQTT identifier for this process
mypid = os.getpid()
pub= "pubclient_"+str(mypid)
mqttc = paho.Client(pub, False) #nocleanstart

#connect to broker
mqttc.connect(broker, port, 60)

#Access to our server and get ids of restaurants
for elt_id in ids:
    conn = httplib.HTTPConnection("www.crous-grenoble.fr") # never http:// and not  end /
    conn.request("GET", "/rss-menu-" +  str(elt_id) + ".htm")		# launch a Get request
    response = conn.getresponse()					   # store the answer
    print response.status, response.reason	 # just print the debug, if success
    data = response.read()				 # get the html as a string '<html >...</html>'
    tree = BeautifulSoup(data)				       # string to a tree structure 

    print tree.channel.title.string
    print  "============\n"
    items = tree.findAll("item")
    msg = ""
    for item in items:
        msg += item.title.string + "--" + item.description.string + "@"
    topic = "menu_crous_" + str(elt_id)
    mqttc.publish(topic, (msg).encode('utf-8'), 0, True)          #qos=0, retain=y
    





